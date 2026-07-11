import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const docsDir = 'C:\\Users\\aathi\\OneDrive\\Documents\\';
const files = fs.readdirSync(docsDir);

for (const file of files) {
  const fullPath = path.join(docsDir, file);
  const ext = path.extname(file).toLowerCase();
  
  if (ext === '.csv' || ext === '.txt') {
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.toLowerCase().includes('stewed plums')) {
        console.log(`Found in text file: ${file}`);
      }
    } catch (err) {}
  } else if (ext === '.xlsx') {
    try {
      const workbook = XLSX.readFile(fullPath);
      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        const match = data.find(row => JSON.stringify(row).toLowerCase().includes('stewed plums'));
        if (match) {
          console.log(`Found in XLSX: ${file} (Sheet: ${sheetName})`);
          console.log(match);
        }
      }
    } catch (err) {}
  }
}
console.log('Search finished.');
