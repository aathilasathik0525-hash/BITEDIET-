import fs from 'fs';
import path from 'path';

const file = 'C:\\Users\\aathi\\OneDrive\\Documents\\BP recipes.csv';
try {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  console.log('Total lines in BP recipes CSV:', lines.length);
  for (let i = 0; i < 15; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
} catch (err) {
  console.error(err);
}
