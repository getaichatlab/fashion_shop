import { DatabaseSync } from 'node:sqlite';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { cloudStorage, databaseContext } from './db-context.ts';

type TransactionClient = {
 query(text: string, values?: unknown[]): Promise<{ rows: any[] }>;
 release(): void;
};
export type TransactionPool = { connect(): Promise<TransactionClient> };
let poolPromise: Promise<TransactionPool> | undefined;
async function cloudPool() {
 poolPromise ??= import('@netlify/database').then(({ getDatabase }) => getDatabase().pool as TransactionPool);
 return poolPromise;
}
const digest = (buffer: Buffer) => createHash('sha256').update(buffer).digest('hex');

// Postgres owns the durable state and serializes mutations across all function
// instances. /tmp is only a working copy; a response is returned after COMMIT.
export async function persistentTransaction<T>(pool: TransactionPool, work: () => T | Promise<T>, stateId = 'main'): Promise<T> {
 const client = await pool.connect();
 let directory: string | undefined;
 let connection: DatabaseSync | undefined;
 try {
  await client.query('BEGIN');
  await client.query("SET LOCAL lock_timeout = '20s'");
  await client.query("SET LOCAL statement_timeout = '25s'");
  await client.query("SET LOCAL idle_in_transaction_session_timeout = '50s'");
  const result = await client.query('SELECT snapshot FROM fashion_state WHERE id=$1 FOR UPDATE', [stateId]);
  if (!result.rows.length) throw Error('Doimiy baza hali tayyorlanmagan.');
  const original = Buffer.from(result.rows[0].snapshot);
  directory = await fs.mkdtemp(path.join(os.tmpdir(), 'fashion-request-'));
  const file = path.join(directory, 'fashion.sqlite');
  await fs.writeFile(file, original);
  connection = new DatabaseSync(file);
  connection.exec('PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL;');
  const response = await databaseContext.run(connection, work);
  connection.exec('PRAGMA wal_checkpoint(TRUNCATE);');
  const changed = await fs.readFile(file);
  if (digest(changed) !== digest(original)) await client.query('UPDATE fashion_state SET snapshot=$1, revision=revision+1, updated_at=NOW() WHERE id=$2', [changed, stateId]);
  await client.query('COMMIT');
  return response;
 } catch (error) {
  try { await client.query('ROLLBACK'); } catch { /* Original failure remains authoritative. */ }
  throw error;
 } finally {
  try {
   connection?.close();
   // The directory is created by mkdtemp above, never derived from user input.
   if (directory) await fs.rm(directory, { recursive: true, force: true });
  } finally { client.release(); }
 }
}
export async function withStorage<T>(work: () => T | Promise<T>): Promise<T> {
 if (!cloudStorage()) {
  if (process.env.NETLIFY === 'true') throw Error('Netlify doimiy saqlash sozlamasi kerak.');
  return work();
 }
 return persistentTransaction(await cloudPool(), work);
}
async function mediaStore() {
 const { getStore } = await import('@netlify/blobs');
 return getStore({ name: 'fashion-media', consistency: 'strong' });
}
export async function readMedia(id: string): Promise<Buffer> {
 if (cloudStorage()) {
  const data = await (await mediaStore()).get(id, { type: 'arrayBuffer' });
  if (!data) throw Error('Media fayli topilmadi.');
  return Buffer.from(data);
 }
 return fs.readFile(path.join(process.cwd(), 'data', 'media', id));
}
export async function writeMedia(id: string, buffer: Buffer) {
 if (cloudStorage()) {
  await (await mediaStore()).set(id, new Uint8Array(buffer).buffer);
  return;
 }
 const directory = path.join(process.cwd(), 'data', 'media');
 await fs.mkdir(directory, { recursive: true });
 await fs.writeFile(path.join(directory, id), buffer);
}
export async function deleteStagedMedia(id: string) {
 if (!id.startsWith('staged-')) throw Error('Vaqtinchalik fayl kaliti noto‘g‘ri.');
 if (cloudStorage()) await (await mediaStore()).delete(id);
 else await fs.unlink(path.join(process.cwd(), 'data', 'media', id)).catch(() => {});
}
