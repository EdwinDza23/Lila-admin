const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove Maritime
html = html.replace(/\s*\{ name: 'Maritime'[^}]+\},?\n/g, '\n');
html = html.replace(/\s*\{ id: 'maritime'[^}]+\},?\n/g, '\n');
html = html.replace(/\s*maritime: 0.005,?\n/g, '\n');
html = html.replace(/, 'maritime'/g, '');
html = html.replace(/<th>Maritime<\/th>/g, '');
html = html.replace(/\s*<div class="bar-row">\s*<div class="bar-label">Maritime<\/div>[\s\S]*?<\/div>\s*<\/div>\n/g, '\n');
html = html.replace(/\s*\.model-avatar\.maritime[\s\S]*?\}\n/g, '\n');
html = html.replace(/\s*\.model-badge\.maritime[\s\S]*?\}\n/g, '\n');
html = html.replace(/\s*'Maritime': \{[^}]+\},?\n/g, '\n');

// 2. Rename Local Model to Ollama
html = html.replace(/Local LLM/g, 'Ollama');
html = html.replace(/Local Model/g, 'Ollama');

// 3. Sort model list
html = html.replace(
  /const filtered = getFilteredModels\(\);/,
  'const filtered = getFilteredModels().sort((a, b) => (b.enabled ? 1 : 0) - (a.enabled ? 1 : 0));'
);

// 4. Update token counts to millions
// fmtK function:
html = html.replace(
  /function fmtK\(n\) \{[\s\S]*?return String\(n\);\s*\}/,
  \unction fmtK(n) {
      if (n === 0) return '0M';
      const m = n / 1000000;
      if (m < 0.01) return m.toFixed(3) + 'M';
      if (m < 0.1) return m.toFixed(2) + 'M';
      return m.toFixed(1) + 'M';
    }\
);
// Hardcoded token counts:
html = html.replace(/2\.1M tok/g, '2.1M tokens');
html = html.replace(/1\.5M tok/g, '1.5M tokens');
html = html.replace(/960K tok/g, '0.96M tokens');
html = html.replace(/>960K</g, '>0.96M<');
html = html.replace(/240K tok/g, '0.24M tokens');
html = html.replace(/>240K</g, '>0.24M<');
html = html.replace(/100K \/ 100K tokens used/g, '0.1M / 0.1M tokens used');
html = html.replace(/174K \/ 200K tokens/g, '0.17M / 0.2M tokens');
html = html.replace(/26K remaining/g, '0.03M remaining');
html = html.replace(/50,000 tokens/g, '0.05M tokens');

// 5. Toggle switch for Monthly and Daily
// Let's see what "currently both show simultaneously" means. 
// Maybe the user means the usage values "100K / 100K tokens used" and something else?
// Wait, I will just add the toggle switch logic.

fs.writeFileSync('index.html.fixed', html);
console.log('Fixed index.html.fixed');
