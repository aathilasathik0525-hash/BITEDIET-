import { Jimp } from 'jimp';

const file = 'C:/Users/aathi/OneDrive/Documents/DiabetesFoodItems_extracted/word/media/029636de523e6a8f8d4f5c644ec32121f2eba7f1.jpg';
try {
  const image = await Jimp.read(file);
  console.log('Width:', image.bitmap.width, 'Height:', image.bitmap.height);
  const cropped = image.clone().crop({ x: 0, y: 0, w: 100, h: 100 });
  console.log('Cropped successfully');
  const buffer = await cropped.getBuffer('image/jpeg');
  console.log('Buffer length:', buffer.length);
} catch (err) {
  console.error(err);
}
