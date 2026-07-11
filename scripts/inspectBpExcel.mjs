import XLSX from 'xlsx';

const file = 'C:\\Users\\aathi\\OneDrive\\Documents\\BP recipes.xlsx';
try {
  const workbook = XLSX.readFile(file);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet);
  console.log('Total rows in BP recipes:', data.length);
  for (let i = 0; i < 10; i++) {
    console.log(`${i + 1}: S.No=${data[i]['S.No']} | Name=${data[i]['Dish Name']} | Suitable For=${data[i]['Suitable For']}`);
  }
} catch (err) {
  console.error(err);
}
