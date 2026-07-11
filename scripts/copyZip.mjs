import fs from 'fs';

const src = 'C:\\Users\\aathi\\OneDrive\\Documents\\normalpeopledishes.zip';
const dest = 'scratch/normalpeopledishes.zip';

console.log("Starting stream copy...");
const rs = fs.createReadStream(src);
const ws = fs.createWriteStream(dest);

rs.on('error', (err) => {
  console.error("Read Stream Error:", err);
});

ws.on('error', (err) => {
  console.error("Write Stream Error:", err);
});

ws.on('finish', () => {
  console.log("Successfully copied normalpeopledishes.zip to scratch!");
});

rs.pipe(ws);
