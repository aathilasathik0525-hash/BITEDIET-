import diabeticSource from '../src/data/diabeticRecipes.js';
import bpSource from '../src/data/bpRecipes.js';
import normalSource from '../src/data/normalRecipes.js';

const checkDist = (source, name) => {
  const dist = {};
  source.forEach(r => {
    const cat = r.category || r.mealType || 'None';
    dist[cat] = (dist[cat] || 0) + 1;
  });
  console.log(`\nCategory distribution for ${name}:`, dist);
};

checkDist(diabeticSource, 'diabetic');
checkDist(bpSource, 'bp');
checkDist(normalSource, 'normal');
