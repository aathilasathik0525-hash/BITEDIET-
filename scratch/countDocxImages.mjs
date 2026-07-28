import fs from 'fs';
import path from 'path';

function countImages(mediaDir, name) {
  if (!fs.existsSync(mediaDir)) {
    console.log(`${name}: media folder does not exist.`);
    return;
  }
  const files = fs.readdirSync(mediaDir);
  console.log(`${name}: found ${files.length} images.`);
}

countImages('scratch/docx_extracted/diabetes/word/media', 'Diabetes');
countImages('scratch/docx_extracted/bp/word/media', 'BP');
countImages('scratch/docx_extracted/normal/word/media', 'Normal');
