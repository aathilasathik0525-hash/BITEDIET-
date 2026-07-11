import { Jimp } from 'jimp';
import Tesseract from 'tesseract.js';
import fs from 'fs';

const images = [
  '029636de523e6a8f8d4f5c644ec32121f2eba7f1.jpg',
  '076beb40e154af09ad654dfdfd3cefb3607a5013.jpg',
  '087c7ef515f6f15022e9a86fc48243ef3874e868.jpg',
  '0b923dfb94c5f1b6c18d5351853e4806527a0e78.jpg',
  '0bef29c86c3eded58000e46504790af1bd166fd7.jpg'
];

const imagesDir = 'C:/Users/aathi/OneDrive/Documents/DiabetesFoodItems_extracted/word/media/';

for (const img of images) {
  const file = imagesDir + img;
  try {
    const image = await Jimp.read(file);
    const cropHeight = Math.ceil(image.bitmap.height * 0.40);
    const cropY = image.bitmap.height - cropHeight;
    const cropped = image.clone().crop({ x: 0, y: cropY, w: image.bitmap.width, h: cropHeight }).greyscale().contrast(0.8).normalize();
    const buffer = await cropped.getBuffer('image/jpeg');
    const { data } = await Tesseract.recognize(buffer, 'eng');
    console.log(`IMAGE: ${img}`);
    console.log(data.text);
    console.log('========================');
  } catch (err) {
    console.error(img, err);
  }
}
