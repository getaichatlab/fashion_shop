import {defineConfig} from '@playwright/test';
import path from 'node:path';
process.env.PLAYWRIGHT_BROWSERS_PATH=path.join(process.cwd(),'.browsers');
export default defineConfig({testDir:'./tests',testMatch:'**/*.spec.ts',fullyParallel:false,workers:1,timeout:45000,use:{baseURL:'http://127.0.0.1:3100',browserName:'chromium',headless:true,trace:'retain-on-failure',screenshot:'only-on-failure'},reporter:[['list'],['html',{open:'never'}]]});
