import fs from 'fs';
import path from 'path';

function getWTags(xmlPath) {
  const content = fs.readFileSync(xmlPath, 'utf8');
  const tRegex = /<w:t\b[^>]*>(.*?)<\/w:t>/gs;
  
  let match;
  const texts = [];
  while ((match = tRegex.exec(content)) !== null) {
    const txt = match[1].trim();
    if (txt) {
      texts.push(txt);
    }
  }
  return texts;
}

const baseDir = 'scratch/docx_extracted';

if (fs.existsSync(path.join(baseDir, 'diabetes', 'word', 'document.xml'))) {
  const diabTexts = getWTags(path.join(baseDir, 'diabetes', 'word', 'document.xml'));
  fs.writeFileSync('scratch/diabetes_texts.txt', diabTexts.join('\n'), 'utf8');
  console.log(`Diabetes: found ${diabTexts.length} text elements.`);
}

if (fs.existsSync(path.join(baseDir, 'bp', 'word', 'document.xml'))) {
  const bpTexts = getWTags(path.join(baseDir, 'bp', 'word', 'document.xml'));
  fs.writeFileSync('scratch/bp_texts.txt', bpTexts.join('\n'), 'utf8');
  console.log(`BP: found ${bpTexts.length} text elements.`);
}

if (fs.existsSync(path.join(baseDir, 'normal', 'word', 'document.xml'))) {
  const normTexts = getWTags(path.join(baseDir, 'normal', 'word', 'document.xml'));
  fs.writeFileSync('scratch/normal_texts.txt', normTexts.join('\n'), 'utf8');
  console.log(`Normal: found ${normTexts.length} text elements.`);
}
