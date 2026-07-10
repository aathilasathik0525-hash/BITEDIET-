const { Jimp } = require('jimp');
(async () => {
  const file = 'C:/Users/aathi/OneDrive/Documents/DiabetesFoodItems_extracted/word/media/029636de523e6a8f8d4f5c644ec32121f2eba7f1.jpg';
  const image = await Jimp.read(file);
  console.log('has grayscale', typeof image.grayscale);
  console.log('has crop', typeof image.crop);
  console.log('crop length', image.crop.length);
  const cropped = image.clone().crop({ x: 0, y: 0, w: 100, h: 100 });
  console.log('cropped type', typeof cropped);
  console.log('cropped keys', Object.keys(cropped).slice(0, 20));
  console.log('crop returned same object?', cropped === image);
})();