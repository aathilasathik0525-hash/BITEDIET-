import fs from 'fs';
const content = fs.readFileSync('scratch/docx_extracted/bp/word/document.xml', 'utf8');
console.log(content.substring(0, 1000));
