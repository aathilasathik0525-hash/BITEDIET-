import fs from 'fs';
import path from 'path';

function searchTags(xmlPath, name) {
  if (!fs.existsSync(xmlPath)) {
    console.log(`${name}: xml file does not exist.`);
    return;
  }
  const content = fs.readFileSync(xmlPath, 'utf8');
  console.log(`${name} XML length: ${content.length}`);
  const hasWT = content.includes('w:t');
  const hasWP = content.includes('w:p');
  const hasDrawing = content.includes('w:drawing');
  const hasBlip = content.includes('embed');
  console.log(`${name}: has w:t=${hasWT}, w:p=${hasWP}, drawing=${hasDrawing}, embed=${hasBlip}`);
  
  // print first 5 occurrences of w:t if present
  if (hasWT) {
    const tRegex = /<w:t\b[^>]*>(.*?)<\/w:t>/gs;
    let match;
    let count = 0;
    while ((match = tRegex.exec(content)) !== null && count < 5) {
      console.log(`  w:t: "${match[1]}"`);
      count++;
    }
  }
}

searchTags('scratch/docx_extracted/diabetes/word/document.xml', 'Diabetes');
searchTags('scratch/docx_extracted/bp/word/document.xml', 'BP');
searchTags('scratch/docx_extracted/normal/word/document.xml', 'Normal');
