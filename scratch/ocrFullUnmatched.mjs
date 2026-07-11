import { Jimp } from 'jimp';
import Tesseract from 'tesseract.js';

const unmatched = [
  '34bbe8323636fc8ebe621802913c5478cb758d01.jpg',
  '5285052498f9f8b00b5991de09835830e9fb598f.jpg',
  '8b0880c548732f367d23e75e3d34f7c2e4d0df31.jpg'
];

const imagesDir = 'C:/Users/aathi/OneDrive/Documents/DiabetesFoodItems_extracted/word/media/';

for (const img of unmatched) {
  const file = imagesDir + img;
  try {
    const image = await Jimp.read(file);
    // No crop, just preprocess the full image
    const processed = image.clone().greyscale().contrast(0.7).normalize();
    const buffer = await processed.getBuffer('image/jpeg');
    const { data } = await Tesseract.recognize(buffer, 'eng');
    console.log(`IMAGE: ${img}`);
    console.log('--- RECOGNIZED TEXT ---');
    console.log(data.text);
    console.log('====================================');
  } catch (err) {
    console.error(img, err);
  }
}
