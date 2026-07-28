import fs from 'fs';
import { allRecipes } from '../src/data/recipeDatabase.js';

const lines = allRecipes.map(r => `ID: ${r.id} | Disease: ${r.disease} | Title: "${r.title}" | Category: "${r.category}" | Image: "${r.image}"`);
fs.writeFileSync('scratch/all_titles.txt', lines.join('\n'), 'utf8');
console.log("Dumped all", allRecipes.length, "recipes to scratch/all_titles.txt");
