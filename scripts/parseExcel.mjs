import XLSX from 'xlsx';

const file = 'C:\\Users\\aathi\\OneDrive\\Documents\\RecipeFull.xlsx';
try {
  const workbook = XLSX.readFile(file);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  console.log('Search for "plum":');
  const plums = data.filter(r => String(r['Recipe Name']).toLowerCase().includes('plum'));
  plums.forEach(r => console.log(`- ${r['Recipe Name']}`));

  console.log('\nSearch for "stewed":');
  const stewed = data.filter(r => String(r['Recipe Name']).toLowerCase().includes('stewed'));
  stewed.forEach(r => console.log(`- ${r['Recipe Name']}`));
} catch (err) {
  console.error(err);
}
