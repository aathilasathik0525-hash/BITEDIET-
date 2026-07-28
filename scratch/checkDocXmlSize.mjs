import fs from 'fs';
const stats = fs.statSync('scratch/docx_extracted/bp/word/document.xml');
console.log(`File size: ${stats.size} bytes`);
const content = fs.readFileSync('scratch/docx_extracted/bp/word/document.xml');
console.log(`Buffer length: ${content.length}`);
console.log("First 100 bytes:");
console.log(content.slice(0, 100));
console.log("First 100 chars as utf-8:");
console.log(content.toString('utf8', 0, 100));
