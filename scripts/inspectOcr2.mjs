import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.resolve(__dirname, '..', 'scratch', 'ocr_results.json');

console.log('Reading file from:', filePath);
const ocr = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log('Total OCR entries:', ocr.length);
ocr.forEach((entry, idx) => {
  console.log(`${idx + 1}: file=${entry.file}`);
  console.log(`  Text: ${JSON.stringify(entry.text)}`);
});
