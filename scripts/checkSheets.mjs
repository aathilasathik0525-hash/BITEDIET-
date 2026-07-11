import XLSX from 'xlsx';

const files = [
  'C:\\Users\\aathi\\OneDrive\\Documents\\Diabetes_Recipes.xlsx',
  'C:\\Users\\aathi\\OneDrive\\Documents\\BP_Recipes.xlsx'
];

for (const file of files) {
  try {
    const workbook = XLSX.readFile(file);
    console.log(file, 'Sheets:', workbook.SheetNames);
  } catch (err) {
    console.error(err);
  }
}
