import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.resolve(__dirname, '..', 'scratch', 'bp_ocr_results.json');
const ocr = JSON.parse(fs.readFileSync(filePath, 'utf8'));

ocr.forEach((entry, idx) => {
  console.log(`${idx + 1}: ${entry.file}`);
  console.log(JSON.stringify(entry.text));
  console.log('---');
});
