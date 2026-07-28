import fs from 'fs';

const ocr = JSON.parse(fs.readFileSync('scratch/diabetic_extracted_titles.json', 'utf8'));

const cleanMap = {};
ocr.forEach(item => {
  let title = item.extractedTitle;
  
  // Clean up typical noise
  title = title.replace(/Recipe/gi, '').trim();
  title = title.replace(/At Layla Helms Blog/gi, '').trim();
  title = title.replace(/At William Bremner/gi, '').trim();
  title = title.replace(/By Swasthi'S/gi, '').trim();
  title = title.replace(/Recept/gi, '').trim();
  title = title.replace(/In Hindi/gi, '').trim();
  title = title.replace(/Sugar-Free Indian Dessert/gi, '').trim();
  title = title.replace(/Street Food Favorite/gi, '').trim();
  title = title.replace(/Online Store For Cold/gi, '').trim();
  title = title.replace(/Indian Veggie Delight/gi, '').trim();
  title = title.replace(/Authentic, Mild & Flavorful/gi, '').trim();
  title = title.replace(/Flavorful Appetizer: 5 Easy/gi, '').trim();
  title = title.replace(/How To Make/gi, '').trim();
  title = title.replace(/Step By Step/gi, '').trim();
  title = title.replace(/6 Flavors/gi, '').trim();
  title = title.replace(/At Rs \d+\/piece/gi, '').trim();
  title = title.replace(/At Rs \d+\/unit/gi, '').trim();
  title = title.replace(/In New Delhi/gi, '').trim();
  title = title.replace(/In Panipat/gi, '').trim();
  title = title.replace(/ReallyEats/gi, '').trim();
  title = title.replace(/Everyday Nourishing Foods/gi, '').trim();
  title = title.replace(/Cook With Sharmila/gi, '').trim();
  title = title.replace(/Subbus Kitchen/gi, '').trim();
  title = title.replace(/Mildly Indian/gi, '').trim();
  title = title.replace(/IndianVegKitchen:/gi, '').trim();
  title = title.replace(/Amaranth Seed Porridge/gi, '').trim();
  title = title.replace(/Soft Steamed Rice Cakes Awaits!/gi, '').trim();
  title = title.replace(/Soft Steamed Rice Cakes/gi, '').trim();
  title = title.replace(/Ultimate Indian/gi, '').trim();
  title = title.replace(/Delicious/gi, '').trim();
  
  // Clean up braces and extra spaces
  title = title.replace(/\s+/g, ' ').trim();
  title = title.replace(/^-\s*/, '').replace(/\s*-$/, '').trim();
  
  // Hand clean special cases
  if (item.file === '0b923dfb94c5f1b6c18d5351853e4806527a0e78.jpg') title = 'Grill Paneer Tikka Skewers';
  if (item.file === '2fd33ad67eb5d63d6d467cb0c299eb26f54ec38a.jpg') title = 'Besan Barfi';
  if (item.file === '8b0880c548732f367d23e75e3d34f7c2e4d0df31.jpg') title = 'Mixed Vegetable Poha';
  if (item.file === '8d34fcb44fcd83fab7a882f886a97b101be46945.jpg') title = 'Grilled Tandoori Chicken with Indian-Style Rice';
  if (item.file === '8ee64519e5129827e53694254bc1ca4722377ec1.jpg') title = 'Vegetable Biryani with Brown Rice';
  if (item.file === '904fa179e9fa9f4cc17bc9ee99cb8670fac4bdfa.jpg') title = 'Soft Steamed Idli';
  if (item.file === 'a6e5c088e4ce047c995b2700424a252c170fba04.jpg') title = 'Steamed Rice Cakes (Idli)';
  if (item.file === 'c5493236a889103fd3319dfc2d57fc2b89fd6638.jpg') title = 'Roasted Makhana';
  if (item.file === 'cc65ea7e3bb2a49f5112b4363279711071aee460.jpg') title = 'Cucumber Mint Raita';
  if (item.file === 'd1f10d61cd4f1297aa3c93d930427f467418fe54.jpg') title = 'Vegetable Moong Dal Chilla';
  if (item.file === 'd51d81c05e6e89c3d8519ffd10e6822e797cefc4.jpg') title = 'Gluten Free Samosa';
  if (item.file === 'da1d10855a1a08f088c7956fed69b8101ace1357.jpg') title = 'Maa Ki Dal';
  if (item.file === 'f4fd592fa1575956d6d8f12044eb871e8b9dbf4a.jpg') title = 'Barley Khichdi (Jau Moong Dal)';
  if (item.file === 'fa213f406bfc988a367ef1c0f295bab98326ff30.jpg') title = 'Lauki Ka Salan';
  if (item.file === '8a34fadaf0a34d66b0303ba0e4302dc40f736419.jpg') title = 'Aloo Methi (Potato Fenugreek Leaves Stir Fry)';
  
  // Clean double pipes/slashes
  title = title.split('|')[0].split('/')[0].trim();
  
  // Strip trailing/leading punctuation again
  title = title
    .replace(/^[^a-zA-Z0-9]+/, '')
    .replace(/[^a-zA-Z0-9)\]!?.':\s,-]+$/, '')
    .trim();
    
  cleanMap[item.file] = title;
});

const content = `const diabeticImageTitles = ${JSON.stringify(cleanMap, null, 2)};\n\nexport default diabeticImageTitles;\n`;
fs.writeFileSync('scratch/diabeticImageTitles.js', content, 'utf8');
console.log("Generated clean diabetic image titles map.");
