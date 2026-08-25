const fs = require('fs');
const path = require('path');

const version = new Date().toISOString();
const outPath = path.join(__dirname, '..', 'public', 'build-meta.json');

fs.writeFileSync(outPath, JSON.stringify({ version }));
console.log('build-meta.json ->', version);
