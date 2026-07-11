import fs from 'fs';
import path from 'path';

function findFile(dir, pattern) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      let stats;
      try {
        stats = fs.statSync(fullPath);
      } catch (e) {
        continue;
      }
      if (stats.isDirectory()) {
        findFile(fullPath, pattern);
      } else if (file.toLowerCase().includes(pattern)) {
        console.log(`Found: ${fullPath}, Size: ${stats.size} bytes`);
      }
    }
  } catch (err) {
    // ignore
  }
}

findFile('C:\\Users\\aathi\\OneDrive', 'normal');
