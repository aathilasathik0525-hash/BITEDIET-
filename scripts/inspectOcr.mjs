import fs from 'fs';

const ocr = JSON.parse(fs.readFileSync('scratch/ocr_results.json', 'utf8'));

console.log('Total OCR entries:', ocr.length);
ocr.slice(0, 20).forEach((entry, idx) => {
  console.log(`${idx + 1}: file=${entry.file}`);
  console.log(`  Text: ${JSON.stringify(entry.text)}`);
});
