import fs from 'fs';

const path = 'C:\\Users\\aathi\\OneDrive - personal\\Documents\\normalpeopledishes.zip';

try {
  if (fs.existsSync(path)) {
    const stats = fs.statSync(path);
    console.log(`Exists: ${path}, Size: ${stats.size} bytes`);
  } else {
    console.log(`Does not exist: ${path}`);
  }
} catch (err) {
  console.error(`Error checking ${path}:`, err.message);
}
