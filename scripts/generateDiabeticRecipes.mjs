import fs from 'fs';
import path from 'path';
const dir = 'public/images/diabetes/DiabetesFoodItems_extracted';
const outPath = 'src/data/diabeticRecipes.js';
if (!fs.existsSync(dir)) {
  console.error('DIR_MISSING', dir);
  process.exit(1);
}
const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.jpg')).sort();
const entries = files.map((f, i) => {
  const name = path.parse(f).name;
  return {
    id: i + 1,
    title: name,
    name,
    disease: 'Diabetes',
    category: 'Lunch',
    image: `/images/diabetes/DiabetesFoodItems_extracted/${f}`,
    ingredients: [`Refer to DiabetesFoodItems_extracted/${f} for ingredient details.`],
    procedure: [`Refer to DiabetesFoodItems_extracted/${f} for the full cooking procedure.`],
    calories: '—',
    protein: '—',
    carbohydrates: '—',
    carbs: '—',
    fat: '—',
    fiber: '—',
    cookingTime: '—',
    servings: '—',
    source: 'DiabetesFoodItems_extracted',
  };
});
const content = `const diabeticRecipes = ${JSON.stringify(entries, null, 2)};\n\nexport default diabeticRecipes;\n`;
fs.writeFileSync(outPath, content, 'utf8');
console.log('WROTE', outPath, 'entries', entries.length);
