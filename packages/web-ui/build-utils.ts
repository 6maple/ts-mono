import { readdirSync } from 'node:fs';

export const baseOutDir = 'dist';
export const sourceEntryList = readdirSync('./src', {
  withFileTypes: true,
}).filter((item) => item.isFile() || item.isDirectory());
