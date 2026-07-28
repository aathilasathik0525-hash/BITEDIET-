import fs from 'fs';

const diabeticOcr = JSON.parse(fs.readFileSync('scratch/ocr_results.json', 'utf8'));
const bpOcr = JSON.parse(fs.readFileSync('scratch/bp_ocr_results.json', 'utf8'));
const normalOcr = JSON.parse(fs.readFileSync('scratch/normal_ocr_results.json', 'utf8'));

const dump = (ocrList, path) => {
  const lines = ocrList.map(item => `FILE: ${item.file}\nTEXT:\n${item.text}\n-----------------------------------------`);
  fs.writeFileSync(path, lines.join('\n'), 'utf8');
};

dump(diabeticOcr, 'scratch/diabetic_ocr_clean.txt');
dump(bpOcr, 'scratch/bp_ocr_clean.txt');
dump(normalOcr, 'scratch/normal_ocr_clean.txt');

console.log("Dumped cleaned OCR files.");
