import fs from 'fs';
import path from 'path';

const xmlPath = 'c:\\Users\\aathi\\OneDrive\\Desktop\\BITEDIET--main\\hotel_extracted\\word\\document.xml';
const outputPath = 'c:\\Users\\aathi\\OneDrive\\Desktop\\BITEDIET--main\\scratch\\hotel_text.txt';

if (!fs.existsSync(xmlPath)) {
  console.error("document.xml not found at", xmlPath);
  process.exit(1);
}

const xmlContent = fs.readFileSync(xmlPath, 'utf8');

// Simple regex to extract text between <w:t> tags
const regex = /<w:t[^>]*>(.*?)<\/w:t>/g;
let match;
const textBlocks = [];

while ((match = regex.exec(xmlContent)) !== null) {
  textBlocks.push(match[1]);
}

const fullText = textBlocks.join('\n');
fs.writeFileSync(outputPath, fullText, 'utf8');

console.log("Successfully extracted text from docx to", outputPath);
