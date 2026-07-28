import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk('scratch/docx_extracted');
console.log(`Found ${files.length} files in extracted directories.`);
if (files.length > 0) {
  console.log("First 10 files:");
  files.slice(0, 10).forEach(f => console.log(f));
}
