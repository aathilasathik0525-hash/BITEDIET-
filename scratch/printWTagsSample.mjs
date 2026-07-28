import fs from 'fs';
const content = fs.readFileSync('scratch/docx_extracted/bp/word/document.xml', 'utf8');
const idx = content.indexOf('w:t');
if (idx !== -1) {
  console.log("Found w:t at index", idx);
  console.log(content.substring(idx - 20, idx + 100));
} else {
  console.log("No w:t found in content.");
}
