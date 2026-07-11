import { Jimp } from 'jimp';
import Tesseract from 'tesseract.js';

const file = 'C:/Users/aathi/OneDrive/Documents/DiabetesFoodItems_extracted/word/media/029636de523e6a8f8d4f5c644ec32121f2eba7f1.jpg';
try {
  const image = await Jimp.read(file);
  const cropHeight = Math.ceil(image.bitmap.height * 0.32);
  const cropY = image.bitmap.height - cropHeight;
  const cropped = image.clone().crop({ x: 0, y: cropY, w: image.bitmap.width, h: cropHeight }).greyscale().contrast(0.8).normalize();
  const buffer = await cropped.getBuffer('image/jpeg');
  
  const { data } = await Tesseract.recognize(buffer, 'eng');
  console.log('Text recognized:');
  console.log(data.text);
} catch (err) {
  console.error(err);
}
