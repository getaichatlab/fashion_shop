import { AsyncLocalStorage } from 'node:async_hooks';
import type { DatabaseSync } from 'node:sqlite';

// A separate SQLite connection per cloud request prevents concurrent requests
// from sharing a transaction or another user's temporary database.
export const databaseContext = new AsyncLocalStorage<DatabaseSync>();
export function cloudStorage() { return process.env.FASHION_STORAGE === 'netlify'; }
