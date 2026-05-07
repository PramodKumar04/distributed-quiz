const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js') && f !== 'fix_imports.js');

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace require('./some/path/module') with require('./module')
  // Specifically: match require(' followed by any valid path that has slashes
  content = content.replace(/require\(['"](\.\/|\.\.\/)(.*?)['"]\)/g, (match, prefix, modulePath) => {
    // extract basename of the module path
    const moduleName = path.basename(modulePath);
    console.log(`Fixing ${modulePath} -> ${moduleName} in ${file}`);
    return `require('./${moduleName}')`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
console.log('Done fixing imports.');
