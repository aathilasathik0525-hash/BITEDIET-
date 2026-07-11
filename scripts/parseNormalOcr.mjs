import fs from 'fs';
import path from 'path';

const results = JSON.parse(fs.readFileSync('scratch/normal_ocr_results.json', 'utf8'));

results.forEach((res, idx) => {
  const lines = res.text.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 2);
  console.log(`${idx + 1}: File="${res.file}" -> OCR Lines:`, lines.slice(-4));
});
