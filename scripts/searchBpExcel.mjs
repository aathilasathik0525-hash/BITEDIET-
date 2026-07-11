import XLSX from 'xlsx';

const file = 'C:\\Users\\aathi\\OneDrive\\Documents\\BP recipes.xlsx';
try {
  const workbook = XLSX.readFile(file);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  const keywords = ['plum', 'apple', 'payasam', 'rasam', 'tikka', 'bhurji', 'stew', 'fish'];
  keywords.forEach(kw => {
    console.log(`Search for "${kw}":`);
    const matches = data.filter(r => String(r['Dish Name']).toLowerCase().includes(kw));
    matches.forEach(r => {
      console.log(`  S.No=${r['S.No']} | Name=${r['Dish Name']}`);
    });
  });
} catch (err) {
  console.error(err);
}
