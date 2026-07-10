import fs from 'fs';
import path from 'path';
import { Jimp } from 'jimp';
import * as Tesseract from 'tesseract.js';

const imagesDir = path.resolve('C:/Users/aathi/OneDrive/Documents/DiabetesFoodItems_extracted/word/media');
const cropFraction = 0.32; // crop bottom portion where title overlay typically appears

const files = fs.readdirSync(imagesDir)
  .filter((file) => file.toLowerCase().endsWith('.jpg'))
  .sort();

async function recognizeImage(file, worker) {
  const filePath = path.join(imagesDir, file);

  try {
    const image = await Jimp.read(filePath);
    const { width, height } = image.bitmap;
    const cropHeight = Math.ceil(height * cropFraction);
    const cropY = height - cropHeight;

    const cropped = image.clone().crop(0, cropY, width, cropHeight).greyscale().contrast(0.7).normalize();
    const buffer = await new Promise((resolve, reject) => {
      cropped.getBuffer('image/jpeg', (err, buf) => (err ? reject(err) : resolve(buf)));
    });

    const { data } = await worker.recognize(buffer);
    const text = data.text.replace(/\r/g, ' ').replace(/\n+/g, '\n').trim();
    return { file, text };
  } catch (error) {
    return { file, error: error.message || String(error) };
  }
}

(async () => {
  const worker = await Tesseract.createWorker({ logger: () => {} });
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  await worker.setParameters({ tessedit_pageseg_mode: '6' });

  for (const file of files) {
    const result = await recognizeImage(file, worker);
    console.log('FILE:', result.file);
    if (result.error) {
      console.log('ERROR:', result.error);
    } else {
      console.log(result.text);
    }
    console.log('---');
  }

  await worker.terminate();
})();
