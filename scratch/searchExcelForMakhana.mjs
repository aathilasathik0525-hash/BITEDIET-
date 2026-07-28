import XLSX from 'xlsx';

const workbook = XLSX.readFile('C:\\Users\\aathi\\OneDrive\\Documents\\RecipeFull.xlsx');
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const recipes = XLSX.utils.sheet_to_json(worksheet);

recipes.forEach(r => {
  const name = r['Recipe Name'];
  if (name && name.toLowerCase().includes('makhana')) {
    console.log(`Excel recipe: "${name}"`);
  }
});
