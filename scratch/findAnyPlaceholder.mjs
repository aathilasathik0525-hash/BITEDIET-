import diabeticRecipes from '../src/data/diabeticRecipes.js';
import bpRecipes from '../src/data/bpRecipes.js';
import normalRecipes from '../src/data/normalRecipes.js';

function deepCheck(recipes, name) {
  let issueCount = 0;
  recipes.forEach(r => {
    const issues = [];
    
    // Check all fields
    for (const [key, value] of Object.entries(r)) {
      const strVal = String(JSON.stringify(value)).toLowerCase();
      if (
        strVal.includes('refer to') || 
        strVal.includes('coming soon') || 
        strVal.includes('tbd') || 
        strVal.includes('placeholder') ||
        value === '' || 
        value === null || 
        value === undefined ||
        (Array.isArray(value) && value.length === 0)
      ) {
        issues.push(`${key}: ${JSON.stringify(value)}`);
      }
    }
    
    if (issues.length > 0) {
      console.log(`[${name}] Recipe "${r.title}" (ID: ${r.id}) has issues:`);
      issues.forEach(i => console.log(`  - ${i}`));
      issueCount++;
    }
  });
  console.log(`[${name}] Total recipes with any potential placeholder/empty values: ${issueCount} / ${recipes.length}`);
}

deepCheck(diabeticRecipes, 'Diabetes');
deepCheck(bpRecipes, 'BP');
deepCheck(normalRecipes, 'Normal');
