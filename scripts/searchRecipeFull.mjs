import XLSX from 'xlsx';

const file = 'C:\\Users\\aathi\\OneDrive\\Documents\\RecipeFull.xlsx';
try {
  const workbook = XLSX.readFile(file);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  const keywords = ['plums with cinnamon', 'stewed apples', 'ragi semiya payasam', 'chicken clear soup', 'boneless chicken tikka', 'egg bhurji', 'chicken stew', 'steamed fish with ginger'];
  keywords.forEach(kw => {
    console.log(`Search for "${kw}":`);
    const matches = data.filter(r => String(r['Recipe Name']).toLowerCase().includes(kw));
    matches.forEach(r => {
      console.log(`  Name: ${r['Recipe Name']}`);
    });
  });
} catch (err) {
  console.error(err);
}
