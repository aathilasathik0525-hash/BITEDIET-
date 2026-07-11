import { Jimp } from 'jimp';
import Tesseract from 'tesseract.js';

const file = 'C:/Users/aathi/OneDrive/Documents/DiabetesFoodItems_extracted/word/media/5285052498f9f8b00b5991de09835830e9fb598f.jpg';
try {
  const image = await Jimp.read(file);
  // Crop the middle portion
  const cropHeight = Math.ceil(image.bitmap.height * 0.50);
  const cropY = Math.ceil(image.bitmap.height * 0.25);
  const cropped = image.clone().crop({ x: 0, y: cropY, w: image.bitmap.width, h: cropHeight }).greyscale().contrast(0.7).normalize();
  const buffer = await cropped.getBuffer('image/jpeg');
  const { data } = await Tesseract.recognize(buffer, 'eng');
  console.log('--- RECOGNIZED TEXT MIDDLE ---');
  console.log(data.text);
} catch (err) {
  console.error(err);
}
