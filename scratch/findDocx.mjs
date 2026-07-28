import fs from 'fs';
import path from 'path';

const searchDirs = [
  'c:\\Users\\aathi\\OneDrive\\Desktop\\BITEDIET--main',
  'c:\\Users\\aathi\\OneDrive\\Desktop',
  'c:\\Users\\aathi\\OneDrive\\Documents',
  'c:\\Users\\aathi\\OneDrive'
];

searchDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    try {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        if (file.endsWith('.docx')) {
          console.log(`Found docx in ${dir}: ${file}`);
        }
      });
    } catch (e) {
      console.error(`Failed to read ${dir}: ${e.message}`);
    }
  }
});
