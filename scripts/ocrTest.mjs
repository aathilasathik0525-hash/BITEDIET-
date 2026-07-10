import { Jimp } from 'jimp';
import * as Tesseract from 'tesseract.js';

const file = 'C:/Users/aathi/OneDrive/Documents/DiabetesFoodItems_extracted/word/media/029636de523e6a8f8d4f5c644ec32121f2eba7f1.jpg';
console.log('file', file);

const image = await Jimp.read(file);
console.log('loaded', image.bitmap.width, image.bitmap.height);
const cropHeight = Math.ceil(image.bitmap.height * 0.30);
const cropY = image.bitmap.height - cropHeight;
const cropped = image.clone().crop({ x: 0, y: cropY, w: image.bitmap.width, h: cropHeight }).greyscale().contrast(0.8).normalize();
const buffer = await new Promise((resolve, reject) => {
  cropped.getBuffer(Jimp.MIME_JPEG, (err, buf) => err ? reject(err) : resolve(buf));
});
const { data } = await Tesseract.recognize(buffer, 'eng', {
  logger: (m) => {
    if (m.status === 'recognizing text') {
      process.stdout.write('.');
    }
  },
});
console.log('\ntext:', JSON.stringify(data.text));
