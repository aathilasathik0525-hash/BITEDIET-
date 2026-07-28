import diabeticSource from '../src/data/diabeticRecipes.js';
import bpSource from '../src/data/bpRecipes.js';
import normalSource from '../src/data/normalRecipes.js';

console.log("Diabetic raw count:", diabeticSource.length);
console.log("BP raw count:", bpSource.length);
console.log("Normal raw count:", normalSource.length);

const inspect = (source, name) => {
  console.log(`\n--- Inspect ${name} ---`);
  source.forEach((r, idx) => {
    if (!r.title && !r.name) {
      console.log(`Index ${idx} is missing both title and name! Image: ${r.image}`);
    } else {
      const t = r.title || r.name;
      if (t.match(/recipe|kichadi|khichdi|kichadi\s*\d+|recipe\s*\d+|dish|food|sample/i)) {
        console.log(`Index ${idx} | ID: ${r.id} | Title: "${t}" | Image: ${r.image}`);
      }
    }
  });
};

inspect(diabeticSource, "diabetic");
inspect(bpSource, "bp");
inspect(normalSource, "normal");
