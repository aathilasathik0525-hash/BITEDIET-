import fs from 'fs';
import diabeticSource from '../src/data/diabeticRecipes.js';
import bpSource from '../src/data/bpRecipes.js';
import normalSource from '../src/data/normalRecipes.js';

const inspectDetailed = (source, name) => {
  const lines = source.map(r => `Title: "${r.title || r.name}" | Raw Category: "${r.category || r.mealType}" | Image: "${r.image}"`);
  fs.writeFileSync(`scratch/${name}_detailed_cats.txt`, lines.join('\n'), 'utf8');
};

inspectDetailed(diabeticSource, 'diabetic');
inspectDetailed(bpSource, 'bp');
inspectDetailed(normalSource, 'normal');

console.log("Dumped detailed categories.");
