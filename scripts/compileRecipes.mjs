import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ocrPath = path.resolve(__dirname, '..', 'scratch', 'ocr_results.json');
const excelPath = 'C:\\Users\\aathi\\OneDrive\\Documents\\RecipeFull.xlsx';

const ocr = JSON.parse(fs.readFileSync(ocrPath, 'utf8'));
const workbook = XLSX.readFile(excelPath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const recipes = XLSX.utils.sheet_to_json(worksheet);

console.log(`Loaded ${ocr.length} OCR entries and ${recipes.length} Excel recipes.`);

const stopWords = new Set(['recipe', 'style', 'how', 'to', 'make', 'easy', 'healthy', 'indian', 'with', 'and', 'in', 'at', 'on', 'the', 'of', 'for', 'delicious', 'authentic', 'homemade']);

function getTokens(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));
}

const mappings = [];
for (const entry of ocr) {
  const ocrTokens = getTokens(entry.text);
  
  let bestMatch = null;
  let highestScore = 0;
  
  for (const recipe of recipes) {
    const recipeName = recipe['Recipe Name'];
    const recipeTokens = getTokens(recipeName);
    
    if (recipeTokens.length === 0) continue;
    
    // Calculate overlap
    let matchCount = 0;
    for (const token of recipeTokens) {
      if (ocrTokens.includes(token)) {
        matchCount++;
      }
    }
    
    const score = matchCount / recipeTokens.length;
    
    // Tie-breaker: prefer longer matches or higher match count
    if (score > highestScore || (score === highestScore && score > 0 && matchCount > (bestMatch ? getTokens(bestMatch['Recipe Name']).filter(t => ocrTokens.includes(t)).length : 0))) {
      highestScore = score;
      bestMatch = recipe;
    }
  }
  
  // Set threshold
  if (highestScore >= 0.5) {
    mappings.push({
      file: entry.file,
      ocrText: entry.text,
      matchedRecipe: bestMatch['Recipe Name'],
      score: highestScore,
      recipeDetails: bestMatch
    });
  } else {
    mappings.push({
      file: entry.file,
      ocrText: entry.text,
      matchedRecipe: null,
      score: highestScore,
      recipeDetails: null
    });
  }
}

const matchedCount = mappings.filter(m => m.matchedRecipe).length;
console.log(`Matched ${matchedCount} / ${ocr.length} recipes.`);

const unmatched = mappings.filter(m => !m.matchedRecipe);
console.log('Unmatched count:', unmatched.length);
if (unmatched.length > 0) {
  console.log('First 10 unmatched:');
  unmatched.slice(0, 10).forEach(u => {
    console.log(`- File: ${u.file} (Best score: ${u.score})`);
    console.log(`  Text: ${JSON.stringify(u.ocrText)}`);
  });
}

// Let's write the mappings to a temp file so we can view them
fs.writeFileSync('scratch/matched_recipes.json', JSON.stringify(mappings, null, 2));
