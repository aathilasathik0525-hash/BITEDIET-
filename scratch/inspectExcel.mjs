import XLSX from 'xlsx';

const workbook = XLSX.readFile('C:\\Users\\aathi\\OneDrive\\Documents\\RecipeFull.xlsx');
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const recipes = XLSX.utils.sheet_to_json(worksheet);

console.log("Total recipes in Excel:", recipes.length);

const matched = [];
recipes.forEach((r, idx) => {
  const name = String(r['Recipe Name'] || '');
  if (name.match(/recipe|kichadi|khichdi|kichadi\s*\d+|recipe\s*\d+|dish|food|sample/i)) {
    matched.push({ index: idx + 2, name: name, diet: r['Diet'], course: r['Course'] });
  }
});

console.log("Found matches in Excel:", matched.length);
console.log("First 30 matches:");
console.log(matched.slice(0, 30));
