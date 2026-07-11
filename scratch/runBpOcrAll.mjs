import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Jimp } from 'jimp';
import Tesseract from 'tesseract.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.resolve(__dirname, '..', 'public', 'images', 'bp', 'BPFoodItems_extracted');
const outputJsonPath = path.resolve(__dirname, '..', 'scratch', 'bp_ocr_results.json');

const files = fs.readdirSync(imagesDir)
  .filter(f => f.endsWith('.jpg'))
  .sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0]);
    const numB = parseInt(b.match(/\d+/)[0]);
    return numA - numB;
  });

console.log(`Found ${files.length} images to process.`);

const results = [];
let count = 0;

for (const file of files) {
  const filePath = path.join(imagesDir, file);
  count++;
  try {
    const image = await Jimp.read(filePath);
    // Crop bottom 20% of the image where the black text bar resides
    const cropHeight = Math.ceil(image.bitmap.height * 0.20);
    const cropY = image.bitmap.height - cropHeight;
    const cropped = image.clone().crop({ x: 0, y: cropY, w: image.bitmap.width, h: cropHeight }).greyscale().contrast(0.7).normalize();
    const buffer = await cropped.getBuffer('image/jpeg');
    const { data } = await Tesseract.recognize(buffer, 'eng');
    
    // Fallback to full image if bottom crop text is empty or too short
    let text = data.text.trim();
    if (text.length < 5) {
      const fullProcessed = image.clone().greyscale().contrast(0.7).normalize();
      const fullBuffer = await fullProcessed.getBuffer('image/jpeg');
      const fullRes = await Tesseract.recognize(fullBuffer, 'eng');
      text = fullRes.data.text.trim();
    }
    
    console.log(`[${count}/${files.length}] Processed ${file}: ${JSON.stringify(text.split('\n').filter(l => l.trim().length > 3).pop())}`);
    results.push({ file, text });
  } catch (err) {
    console.error(`Error processing ${file}:`, err);
    results.push({ file, text: '', error: err.message });
  }
}

fs.writeFileSync(outputJsonPath, JSON.stringify(results, null, 2));
console.log(`Done! Saved to ${outputJsonPath}`);
