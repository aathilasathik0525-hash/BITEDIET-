import fs from 'fs';
import XLSX from 'xlsx';

const csvPath = 'C:\\Users\\aathi\\OneDrive\\Documents\\Diabetes_Recipes.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');

const names = [
  'Kala Chana Chaat',
  'Besan Chilla',
  'Moringa Drumstick Curry',
  'Grill Paneer Tikka Skewers',
  'Indian Chicken Curry Soup',
  'Lauki Moong Dal',
  'Mix Veg Sambar',
  'Roasted Makhana',
  'Sattu Paratha',
  'Corn and Spinach Salad',
  'Mixed Vegetable Clear Soup',
  'Foxtail Millet Kheer',
  'Steamed Vegetable Momos',
  'Quinoa Pulao'
];

for (const name of names) {
  const found = csvContent.toLowerCase().includes(name.toLowerCase());
  console.log(`Name: '${name}' -> Found in CSV: ${found}`);
}
