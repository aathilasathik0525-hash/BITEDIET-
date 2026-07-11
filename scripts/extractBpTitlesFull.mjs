import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.resolve(__dirname, '..', 'scratch', 'bp_ocr_full_results.json');
const ocr = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Filter noise words
function cleanOcrTitle(text, fileName) {
  if (!text) return 'Unknown BP Recipe';
  
  // Specific hardcoded fixes for known problematic images
  const nameIndex = parseInt(fileName.match(/\d+/)[0]);
  if (nameIndex === 4) return 'Fruit Custard';
  if (nameIndex === 7) return 'Grilled Indian Boneless Chicken Tikka Breasts';
  if (nameIndex === 11) return 'Traditional Indian Fish Curry';
  if (nameIndex === 12) return 'Tandoori Gobi';
  if (nameIndex === 13) return 'Paneer Bhurji';
  if (nameIndex === 15) return 'Veg Cutlet';
  if (nameIndex === 18) return 'Crispy Baked Vegetable Samosas';
  if (nameIndex === 19) return 'Handvo (Baked & Stovetop)';
  if (nameIndex === 42) return 'Vegetable Poha';
  if (nameIndex === 48) return 'Rava Dosa';
  if (nameIndex === 63) return 'Vegetable Quinoa Upma';
  if (nameIndex === 73) return 'Indian Paneer Capsicum Sabzi';
  if (nameIndex === 81) return 'Aloo Gobi';
  if (nameIndex === 84) return 'Baingan Bharta';
  if (nameIndex === 94) return 'Rajma Masala';
  if (nameIndex === 98) return 'Easy Masoor Dal';

  const lines = text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 3);
  
  const candidates = lines.filter(line => {
    // If the line has typical noise or is just website info
    if (line.match(/https?:\/\//i) || line.match(/www\./i) || line.match(/\.com/i) || line.match(/pinterest/i)) {
      return false;
    }
    return true;
  });
  
  if (candidates.length === 0) return 'Unknown BP Recipe';
  
  const foodKeywords = ['stewed', 'plum', 'apple', 'payasam', 'soup', 'salad', 'curry', 'rice', 'dal', 'dosa', 'idli', 'roti', 'khichdi', 'bhurji', 'raita', 'poriyal', 'masala', 'kootu', 'thoran', 'biryani', 'sambar', 'upma', 'chutney', 'poha', 'dhokla', 'tikki', 'chaat', 'kebab', 'cutlet', 'paneer', 'chicken', 'fish', 'millet', 'ragi', 'semia', 'kheer', 'ladoo', 'payasam', 'halwa', 'rasam', 'stew', 'gravy', 'sabzi', 'flatbread', 'phulka', 'chapathi'];
  
  let bestLine = '';
  let highestScore = -1;
  
  for (const line of candidates) {
    let score = 0;
    foodKeywords.forEach(kw => {
      if (line.toLowerCase().includes(kw)) {
        score += 10;
      }
    });
    if (line.length >= 10 && line.length <= 85) {
      score += 5;
    }
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
    bestLine = candidates[candidates.length - 1];
  }
  
  let cleaned = bestLine
    .replace(/^[^a-zA-Z0-9]+/, '')
    .replace(/[^a-zA-Z0-9)\]!?.':\s,-]+$/, '')
    .trim();
  
  // Capitalize properly
  cleaned = cleaned.replace(/\b\w/g, c => c.toUpperCase());
  
  // Specific cleanups of common OCR trailing noise
  cleaned = cleaned
    .replace(/\s+-\s*$/, '')
    .replace(/\s*\|\s*$/, '')
    .replace(/:+$/, '')
    .trim();
    
  return cleaned;
}

ocr.forEach((entry, idx) => {
  const title = cleanOcrTitle(entry.text, entry.file);
  console.log(`${idx + 1}: file=${entry.file} -> Title: ${title}`);
});
