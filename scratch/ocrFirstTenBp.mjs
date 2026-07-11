import { Jimp } from 'jimp';
import Tesseract from 'tesseract.js';

const imagesDir = 'c:/Users/aathi/OneDrive/Desktop/BITEDIET--main/public/images/bp/BPFoodItems_extracted/';

for (let i = 1; i <= 10; i++) {
  const formattedIndex = String(i).padStart(3, '0');
  const file = `${imagesDir}page_${formattedIndex}.jpg`;
  try {
    const image = await Jimp.read(file);
    const processed = image.clone().greyscale().contrast(0.7).normalize();
    const buffer = await processed.getBuffer('image/jpeg');
    const { data } = await Tesseract.recognize(buffer, 'eng');
    console.log(`PAGE ${formattedIndex}:`);
    console.log(data.text.trim());
    console.log('====================================');
  } catch (err) {
    console.error(`Error processing page_${formattedIndex}.jpg:`, err);
  }
}
