import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Jimp } from 'jimp';
import Tesseract from 'tesseract.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.resolve(__dirname, '..', 'public', 'images', 'bp', 'normalpeopledishes');
const outputJsonPath = path.resolve(__dirname, '..', 'scratch', 'normal_ocr_results.json');

const files = fs.readdirSync(imagesDir)
  .filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'));

console.log(`Found ${files.length} normal recipe images to process with OCR.`);

const results = [];
let count = 0;

for (const file of files) {
  const filePath = path.join(imagesDir, file);
  count++;
  try {
    const image = await Jimp.read(filePath);
    const processed = image.clone().greyscale().contrast(0.7).normalize();
    const buffer = await processed.getBuffer('image/jpeg');
    const { data } = await Tesseract.recognize(buffer, 'eng');
    
    const text = data.text.trim();
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 3);
    console.log(`[${count}/${files.length}] Processed ${file}: ${JSON.stringify(lines[lines.length - 1] || '')}`);
    results.push({ file, text });
  } catch (err) {
    console.error(`Error processing ${file}:`, err);
    results.push({ file, text: '', error: err.message });
  }
}

fs.writeFileSync(outputJsonPath, JSON.stringify(results, null, 2));
console.log(`Done! Saved to ${outputJsonPath}`);
