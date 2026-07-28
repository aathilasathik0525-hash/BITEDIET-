import fs from 'fs';
import path from 'path';

function parseXml(xmlPath) {
  const content = fs.readFileSync(xmlPath, 'utf8');
  // Use dotAll flag 's' so . matches newlines
  const pRegex = /<w:p\b[^>]*>(.*?)<\/w:p>/gs;
  const tRegex = /<w:t\b[^>]*>(.*?)<\/w:t>/gs;
  
  let match;
  const paragraphs = [];
  
  while ((match = pRegex.exec(content)) !== null) {
    const pContent = match[1];
    let tMatch;
    let pText = '';
    // Reset tRegex index because we are reusing it
    tRegex.lastIndex = 0;
    while ((tMatch = tRegex.exec(pContent)) !== null) {
      pText += tMatch[1];
    }
    if (pText.trim()) {
      paragraphs.push(pText.trim());
    }
  }
  return paragraphs;
}

const baseDir = 'scratch/docx_extracted';

if (fs.existsSync(path.join(baseDir, 'diabetes', 'word', 'document.xml'))) {
  const diabPars = parseXml(path.join(baseDir, 'diabetes', 'word', 'document.xml'));
  fs.writeFileSync('scratch/diabetes_paragraphs.txt', diabPars.join('\n'), 'utf8');
  console.log(`Diabetes parsed: ${diabPars.length} paragraphs.`);
}

if (fs.existsSync(path.join(baseDir, 'bp', 'word', 'document.xml'))) {
  const bpPars = parseXml(path.join(baseDir, 'bp', 'word', 'document.xml'));
  fs.writeFileSync('scratch/bp_paragraphs.txt', bpPars.join('\n'), 'utf8');
  console.log(`BP parsed: ${bpPars.length} paragraphs.`);
}

if (fs.existsSync(path.join(baseDir, 'normal', 'word', 'document.xml'))) {
  const normPars = parseXml(path.join(baseDir, 'normal', 'word', 'document.xml'));
  fs.writeFileSync('scratch/normal_paragraphs.txt', normPars.join('\n'), 'utf8');
  console.log(`Normal parsed: ${normPars.length} paragraphs.`);
}
