import fs from 'fs';
import path from 'path';

const ocr = JSON.parse(fs.readFileSync('scratch/ocr_results.json', 'utf8'));

const cleanTitle = (text) => {
  if (!text) return 'Unknown Diabetic Dish';
  
  const lines = text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 3);
  
  // Exclude noise lines
  const candidates = lines.filter(line => {
    if (line.match(/https?:\/\//i) || line.match(/www\./i) || line.match(/\.com/i) || line.match(/pinterest/i) || line.match(/instagram/i) || line.match(/facebook/i) || line.match(/youtube/i)) {
      return false;
    }
    // Filter lines that are just numbers/hashes/special characters
    if (line.match(/^[0-9\s\W]+$/)) {
      return false;
    }
    return true;
  });
  
  if (candidates.length === 0) return 'Unknown Diabetic Dish';
  
  // Pick the line that looks most like a title
  // A title line typically contains food words
  const foodKeywords = ['salad', 'chilla', 'cheela', 'curry', 'paneer', 'soup', 'dal', 'sambar', 'makhana', 'chicken', 'paratha', 'kheer', 'momos', 'pulao', 'khichdi', 'kebab', 'roti', 'lobia', 'gassi', 'thoran', 'raita', 'modak', 'brownie', 'chai', 'tikki', 'halwa', 'rice', 'bhurji', 'dosa', 'karela', 'chutney', 'sabzi', 'thalipeeth', 'chaat', 'arbi', 'poha', 'samosa', 'shorba', 'kurma', 'salan', 'kaddu'];
  
  let bestLine = '';
  let highestScore = -1;
  
  for (const line of candidates) {
    let score = 0;
    foodKeywords.forEach(kw => {
      if (line.toLowerCase().includes(kw)) {
        score += 15;
      }
    });
    
    // Title length heuristic
    if (line.length >= 10 && line.length <= 60) {
      score += 10;
    } else if (line.length > 60) {
      score -= 5;
    }
    
    // Ratio of alphabetic characters
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
  
  // Strip trailing/leading punctuation
  let cleaned = bestLine
    .replace(/^[^a-zA-Z0-9]+/, '')
    .replace(/[^a-zA-Z0-9)\]!?.':\s,-]+$/, '')
    .trim();
    
  // Clean up common Pinterest dividers/descriptions
  cleaned = cleaned.split('|')[0].split(' - ')[0].split(' :: ')[0].trim();
  
  // Capitalize words
  cleaned = cleaned.replace(/\b\w/g, c => c.toUpperCase());
  
  return cleaned;
};

const results = ocr.map(item => {
  return {
    file: item.file,
    originalText: item.text,
    extractedTitle: cleanTitle(item.text)
  };
});

fs.writeFileSync('scratch/diabetic_extracted_titles.json', JSON.stringify(results, null, 2), 'utf8');
console.log("Extracted", results.length, "titles.");
