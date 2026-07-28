import fs from 'fs';

const matched = JSON.parse(fs.readFileSync('scratch/matched_recipes.json', 'utf8'));

const lines = matched.map((item, idx) => {
  return `${idx + 1}: file=${item.file} -> matchedRecipe="${item.matchedRecipe}" | score=${item.score} | ocrTextSummary="${item.ocrText.replace(/\n/g, ' ').substring(0, 100)}"`;
});

fs.writeFileSync('scratch/view_matched_recipes.txt', lines.join('\n'), 'utf8');
console.log("Dumped matched recipes list.");
