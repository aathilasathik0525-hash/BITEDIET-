import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const excelPath = 'C:\\Users\\aathi\\OneDrive\\Documents\\RecipeFull.xlsx';

const workbook = XLSX.readFile(excelPath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const recipes = XLSX.utils.sheet_to_json(worksheet);

// Exact BP titles we got from images
const bpImageTitleOverrides = {
  1: "Stewed Plums with Cinnamon",
  2: "Simple Stewed Apples with Cinnamon and Cardamom",
  3: "Ragi Semiya Payasam",
  4: "Fruit Custard",
  5: "Chicken Clear Soup",
  6: "Rasam",
  7: "Grilled Indian Boneless Chicken Tikka Breasts",
  8: "Egg Bhurji (Indian Scrambled Eggs)",
  9: "Chicken Stew",
  10: "Northeast Indian Style Steamed Fish with Ginger and Spring Onion",
  11: "Traditional Indian Fish Curry",
  12: "Tandoori Gobi",
  13: "Paneer Bhurji",
  14: "Minty Roasted Makhana",
  15: "Veg Cutlet",
  16: "Moong Sprouts Chaat",
  17: "Indian Spiced Vegetable Cutlets",
  18: "Crispy Baked Vegetable Samosas",
  19: "Handvo (Baked & Stovetop)",
  20: "Dal Dhokla",
  21: "Spicy Street Chana Chaat",
  22: "Pomegranate Spinach Salad with Oranges and Pumpkin",
  23: "Vermicelli Paneer Cucumber Salad with Curd",
  24: "Kachumber Salad",
  25: "Cucumber Carrot Salad",
  26: "Indian Style Beet Salad",
  27: "Sprouted Moong Salad",
  28: "Mixed Vegetable Chaat",
  29: "Boondi Raita",
  30: "Cucumber Raita",
  31: "Bottle Gourd Soup",
  32: "Milagu Rasam (Hot Pepper Rasam)",
  33: "Garlic Rasam",
  34: "Green Moong Dal",
  35: "Sweet Corn Soup",
  36: "Carrot Soup",
  37: "Indian Style Spinach Soup (Palak Shorba)",
  38: "Indian Lentil Soup",
  39: "Veg Clear Soup",
  40: "Indian Tomato Soup",
  41: "Oats Upma",
  42: "Vegetable Poha",
  43: "Kerala Style Vegetable Stew with Coconut Milk",
  44: "Cucumber Curd Pachadi",
  45: "Avial (Kerala Style Mixed Veg Curry)",
  46: "Traditional South Indian Spiced Rasam",
  47: "Sambar",
  48: "Rava Dosa",
  49: "Ragi Idli / Dosa",
  50: "Plain Dosa",
  51: "South Indian Oats Idli",
  52: "Ragi Idli (Finger Millet Idli)",
  53: "Authentic South Indian Idli",
  54: "Missi Roti (Gram Flour Flatbread)",
  55: "Roti / Phulka",
  56: "Indian Ragi Roti (Finger Millet Flatbread)",
  57: "Jowar Roti (Indian Sorghum Flatbread)",
  58: "Bajra Roti (Pearl Millet Flatbread)",
  59: "Multigrain Roti",
  60: "Indian Whole Wheat Roti",
  61: "Ragi Kanji (Finger Millet Sweet Porridge)",
  62: "Vegetable Upma",
  63: "Vegetable Quinoa Upma",
  64: "Rajasthani Bajra Khichdi",
  65: "Moong Dal Khichdi",
  66: "South Indian Lemon Rice (Chitranna)",
  67: "Curd Rice (Thayir Sadam)",
  68: "Vegetable Pulao",
  69: "Instant Pot Brown Rice",
  70: "Steamed Plain Rice",
  71: "Elephant Yam Suran Fry",
  72: "Raw Banana Sabzi",
  73: "Indian Paneer Capsicum Sabzi",
  74: "Moringa Drumstick Curry",
  75: "Gawar Ki Sabzi (Cluster Beans Curry)",
  76: "Indian Style Pumpkin Stir Fry (Kaddu Sabzi)",
  77: "Easy Mixed Vegetable Curry",
  78: "Gajar Matar Aloo Sabzi (Carrot Peas and Potato Curry)",
  79: "Cabbage Stir Fry (Patta Gobhi Ki Sabzi)",
  80: "Healthy South Indian Beans Poriyal",
  81: "Aloo Gobi",
  82: "Baingan Bharta",
  83: "Dry Karela Sabzi (Bitter Gourd Stir Fry)",
  84: "Baingan Bharta Style",
  85: "Palak Paneer (Indian Spinach Curry with Cheese)",
  86: "Bhindi Masala (Indian Okra Stir Fry)",
  87: "Stuffed Turai Sabzi (Ridge Gourd)",
  88: "Tinda Curry (Apple Gourd Sabji)",
  89: "Bottle Gourd Sabzi (Lauki Sabzi)",
  90: "Panchmel Dal (Five Lentil Soup)",
  91: "Dal Palak (Spinach Lentils)",
  92: "Easy Black Eyed Peas Curry",
  93: "Pindi Chole",
  94: "Rajma Masala",
  95: "Sprouted Mung Salad",
  96: "Chana Dal",
  97: "Toor Dal Tadka",
  98: "Easy Masoor Dal",
  99: "Plain Moong Dal Khichdi"
};

const stopWords = new Set(['recipe', 'style', 'how', 'to', 'make', 'easy', 'healthy', 'indian', 'with', 'and', 'in', 'at', 'on', 'the', 'of', 'for', 'delicious', 'authentic', 'homemade']);

function getTokens(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));
}

Object.entries(bpImageTitleOverrides).forEach(([idxStr, title]) => {
  const ocrTokens = getTokens(title);
  let bestMatch = null;
  let highestScore = 0;
  
  for (const recipe of recipes) {
    const recipeName = recipe['Recipe Name'];
    const recipeTokens = getTokens(recipeName);
    if (recipeTokens.length === 0) continue;
    
    let matchCount = 0;
    for (const token of recipeTokens) {
      if (ocrTokens.includes(token)) {
        matchCount++;
      }
    }
    
    const score = matchCount / recipeTokens.length;
    if (score > highestScore || (score === highestScore && score > 0 && matchCount > (bestMatch ? getTokens(bestMatch['Recipe Name']).filter(t => ocrTokens.includes(t)).length : 0))) {
      highestScore = score;
      bestMatch = recipe;
    }
  }
  
  console.log(`${idxStr}: Title="${title}" -> Matched: ${bestMatch ? bestMatch['Recipe Name'] : 'NULL'} (Score: ${highestScore})`);
});
