import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '..', 'src', 'data', 'diabeticRecipes.js');

const url = pathToFileURL(outputPath).href;
import(url).then((m) => {
  const recipes = m.default;
  console.log('Total recipes in diabeticRecipes.js:', recipes.length);
  
  const counts = {};
  recipes.forEach(r => {
    counts[r.name] = (counts[r.name] || 0) + 1;
  });
  
  const duplicates = Object.entries(counts).filter(([name, count]) => count > 1);
  console.log('Duplicates:', duplicates);
  
  const uniqueCount = Object.keys(counts).length;
  console.log('Unique names count:', uniqueCount);
});
