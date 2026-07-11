import { Jimp } from 'jimp';
import Tesseract from 'tesseract.js';
import fs from 'fs';
import path from 'path';

const imagesDir = 'C:/Users/aathi/OneDrive/Documents/DiabetesFoodItems_extracted/word/media';
const files = fs.readdirSync(imagesDir)
  .filter(file => file.toLowerCase().endsWith('.jpg'))
  .sort();

console.log('Total files to OCR:', files.length);

async function run() {
  const results = [];
  
  // Use a single Tesseract worker or recognize directly
  let count = 0;
  for (const file of files) {
    count++;
    const filePath = path.join(imagesDir, file);
    try {
      const image = await Jimp.read(filePath);
      // Crop bottom 35% where titles usually are
      const cropHeight = Math.ceil(image.bitmap.height * 0.35);
      const cropY = image.bitmap.height - cropHeight;
      const cropped = image.clone().crop({ x: 0, y: cropY, w: image.bitmap.width, h: cropHeight }).greyscale().contrast(0.8).normalize();
      const buffer = await cropped.getBuffer('image/jpeg');
      
      const { data } = await Tesseract.recognize(buffer, 'eng');
      const text = data.text.replace(/\r/g, ' ').replace(/\n+/g, '\n').trim();
      results.push({ file, text });
      console.log(`[${count}/${files.length}] Processed ${file}: ${JSON.stringify(text.split('\n').pop())}`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
      results.push({ file, error: err.message });
    }
  }
  
  fs.writeFileSync('scratch/ocr_results.json', JSON.stringify(results, null, 2));
  console.log('Done! Saved to scratch/ocr_results.json');
}

run().catch(err => console.error(err));
