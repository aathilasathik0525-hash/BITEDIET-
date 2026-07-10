const fs = require('fs');
const path = require('path');
const { Jimp } = require('jimp');
const Tesseract = require('tesseract.js');

const imagesDir = 'C:/Users/aathi/OneDrive/Documents/DiabetesFoodItems_extracted/word/media';
const cropFraction = 0.28;
const outputFile = path.resolve('scripts', 'ocr_titles_output.json');

async function recognizeImage(worker, filePath) {
  const image = await Jimp.read(filePath);
  const { width, height } = image.bitmap;
  const cropHeight = Math.ceil(height * cropFraction);
  const cropY = height - cropHeight;
  const cropped = image.clone().crop(0, cropY, width, cropHeight).greyscale().contrast(0.8).normalize();
  const buffer = await new Promise((resolve, reject) => {
    cropped.getBuffer(Jimp.MIME_JPEG, (err, buf) => (err ? reject(err) : resolve(buf)));
  });
  const { data } = await worker.recognize(buffer);
  const text = data.text.replace(/\r/g, ' ').replace(/\n+/g, '\n').trim();
  return text;
}

(async () => {
  const files = fs.readdirSync(imagesDir).filter((file) => file.toLowerCase().endsWith('.jpg')).sort();
  const results = [];
  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    try {
      const image = await Jimp.read(filePath);
      const { width, height } = image.bitmap;
      const cropHeight = Math.ceil(height * cropFraction);
      const cropY = height - cropHeight;
      const cropped = image.clone().crop(0, cropY, width, cropHeight).greyscale().contrast(0.8).normalize();
      const buffer = await new Promise((resolve, reject) => {
        cropped.getBuffer(Jimp.MIME_JPEG, (err, buf) => (err ? reject(err) : resolve(buf)));
      });

      const { data } = await Tesseract.recognize(buffer, 'eng', { logger: () => {} });
      const text = data.text.replace(/\r/g, ' ').replace(/\n+/g, '\n').trim();
      results.push({ file, text });
      console.log(file, JSON.stringify(text));
    } catch (error) {
      console.error('ERROR', file, error.message || error);
      results.push({ file, error: String(error) });
    }
  }
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log('Wrote', outputFile);
})();
