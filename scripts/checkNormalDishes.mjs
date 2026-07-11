import fs from 'fs';
import path from 'path';

const dirPath = './public/images/bp/normalpeopledishes';

if (fs.existsSync(dirPath)) {
  const files = fs.readdirSync(dirPath);
  console.log(`Directory exists and contains ${files.length} items:`);
  console.log(files.slice(0, 10));
} else {
  console.log("Directory does not exist!");
}
