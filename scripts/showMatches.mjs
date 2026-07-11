import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.resolve(__dirname, '..', 'scratch', 'matched_recipes.json');
const matches = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log('Matches:');
matches.forEach((m, idx) => {
  console.log(`${idx + 1}: ${m.file} -> ${m.matchedRecipe} (Score: ${m.score})`);
});
