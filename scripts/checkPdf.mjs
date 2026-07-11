import fs from 'fs';

const files = [
  'C:\\Users\\aathi\\OneDrive\\Documents\\BiteDiet.pdf',
  'C:\\Users\\aathi\\OneDrive\\Documents\\NutriCook_.pdf'
];

for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    console.log(file, 'Length:', content.length);
    console.log('Contains Kala Chana:', content.toLowerCase().includes('kala chana'));
    console.log('Contains Makhana:', content.toLowerCase().includes('makhana'));
  } catch (err) {
    console.error(err);
  }
}
