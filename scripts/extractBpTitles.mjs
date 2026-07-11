import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.resolve(__dirname, '..', 'scratch', 'bp_ocr_results.json');
const ocr = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const websitePatterns = [
  /pinterest/i, /www\./i, /\.com/i, /\.org/i, /\.net/i, /blog/i, /sharmispassions/i,
  /vegrecipesofindia/i, /archanaskitchen/i, /cookwithmanali/i, /swasthi/i, /yummyytummyy/i,
  /tasty/i, /recipe/i, /step by step/i, /how to/i, /passions/i, /kitchen/i, /hebbars/i,
  /spice/i, /chilli/i, /cup of yum/i, /food/i, /eating/i, /curries/i, /ambrosia/i,
  /delish/i, /tin eats/i, /honey/i, /whats cooking/i, /look/i, /image/i, /watermark/i,
  /ready in/i, /servings/i, /nutrition/i, /calories/i, /protein/i, /fat/i, /carbs/i,
  /fiber/i, /sodium/i, /potassium/i, /milligrams/i, /grams/i, /mg/i, /g/i, /kcal/i
];

function cleanOcrTitle(text) {
  if (!text) return 'Unknown BP Recipe';
  
  const lines = text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 3);
  
  // Find lines that are likely to be the title
  // A title line typically doesn't contain website URLs and has actual food terms
  const candidates = lines.filter(line => {
    // If the line has typical noise or is just website info
    if (line.match(/https?:\/\//i) || line.match(/www\./i) || line.match(/\.com/i) || line.match(/pinterest/i)) {
      return false;
    }
    return true;
  });
  
  if (candidates.length === 0) return 'Unknown BP Recipe';
  
  // Choose the best candidate line
  // Typically, the title is one of the lines at the bottom or middle, containing food words.
  // Let's filter out lines with garbage characters and pick the longest or most meaningful one.
  const foodKeywords = ['stewed', 'plum', 'apple', 'payasam', 'soup', 'salad', 'curry', 'rice', 'dal', 'dosa', 'idli', 'roti', 'khichdi', 'bhurji', 'raita', 'poriyal', 'masala', 'kootu', 'thoran', 'biryani', 'sambar', 'upma', 'chutney', 'poha', 'dhokla', 'tikki', 'chaat', 'kebab', 'cutlet', 'paneer', 'chicken', 'fish', 'millet', 'ragi', 'semia', 'kheer', 'ladoo', 'payasam', 'halwa', 'rasam', 'stew', 'gravy', 'sabzi', 'flatbread', 'phulka', 'chapathi'];
  
  let bestLine = '';
  let highestScore = -1;
  
  for (const line of candidates) {
    let score = 0;
    // Check if line contains food keywords
    foodKeywords.forEach(kw => {
      if (line.toLowerCase().includes(kw)) {
        score += 10;
      }
    });
    // Length penalty/bonus (titles are usually 15-60 chars)
    if (line.length >= 10 && line.length <= 80) {
      score += 5;
    }
    // Filter lines that are mostly non-alphabetic
    const alphaCount = (line.match(/[a-zA-Z]/g) || []).length;
    const ratio = alphaCount / line.length;
    if (ratio < 0.6) {
      score -= 20;
    }
    
    if (score > highestScore) {
      highestScore = score;
      bestLine = line;
    }
  }
  
  if (!bestLine || highestScore < 0) {
    // Fallback to the last line of candidates
    bestLine = candidates[candidates.length - 1];
  }
  
  // Clean up any remaining garbage characters from the beginning/end
  let cleaned = bestLine
    .replace(/^[^a-zA-Z0-9]+/, '')
    .replace(/[^a-zA-Z0-9)\]!?.':\s,-]+$/, '')
    .trim();
  
  // Capitalize properly
  cleaned = cleaned.replace(/\b\w/g, c => c.toUpperCase());
  
  return cleaned;
}

ocr.forEach((entry, idx) => {
  const title = cleanOcrTitle(entry.text);
  console.log(`${idx + 1}: file=${entry.file} -> Title: ${title}`);
});
