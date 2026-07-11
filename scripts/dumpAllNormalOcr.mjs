import fs from 'fs';

const results = JSON.parse(fs.readFileSync('scratch/normal_ocr_results.json', 'utf8'));

let output = '';
results.forEach((res, idx) => {
  const lines = res.text.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 2);
  output += `${idx + 1}: File="${res.file}"\n`;
  lines.forEach(l => {
    output += `  > ${l}\n`;
  });
  output += `\n`;
});

fs.writeFileSync('scratch/normal_ocr_dump.txt', output, 'utf8');
console.log("Dumped all OCR results to scratch/normal_ocr_dump.txt");
