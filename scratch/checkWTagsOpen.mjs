import fs from 'fs';
const content = fs.readFileSync('scratch/docx_extracted/bp/word/document.xml', 'utf8');
const hasOpen = content.includes('<w:t');
const hasClose = content.includes('</w:t>');
console.log(`has <w:t: ${hasOpen}, has </w:t>: ${hasClose}`);
