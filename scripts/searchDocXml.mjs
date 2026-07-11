import fs from 'fs';

const buf = fs.readFileSync('tmp_docx_document.xml');
let docXml = '';
if (buf[0] === 0xff && buf[1] === 0xfe) {
  docXml = buf.toString('utf16le');
} else if (buf[0] === 0xfe && buf[1] === 0xff) {
  docXml = buf.toString('utf16be');
} else {
  docXml = buf.toString('utf8');
}

const terms = ['breakfast', 'lunch', 'dinner', 'snack', 'drink', 'beverage', 'casserole', 'kebab'];
for (const term of terms) {
  const count = (docXml.toLowerCase().split(term).length - 1);
  console.log(`Term '${term}': ${count} occurrences`);
}

// Find any tag name containing text or just any plain text between > and <
// Except tags themselves
const cleanText = docXml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
console.log('Clean text snippet (first 1000 chars):');
console.log(cleanText.substring(0, 1000));
