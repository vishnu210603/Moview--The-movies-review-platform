const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'app', 'components', 'ui');

// Read all files in the components directory
fs.readdir(componentsDir, (err, files) => {
  if (err) {
    console.error('Error reading components directory:', err);
    return;
  }

  // Filter for TypeScript/JavaScript files
  const tsxFiles = files.filter(file => file.endsWith('.tsx') || file.endsWith('.ts'));
  
  tsxFiles.forEach(file => {
    const filePath = path.join(componentsDir, file);
    
    // Read file content
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file ${file}:`, err);
        return;
      }
      
      // Replace import path
      const updatedContent = data.replace(
        /from\s+["']@\/lib\/utils["']/g, 
        'from "../../lib/utils"'
      );
      
      // Write updated content back to file
      fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
        if (err) {
          console.error(`Error writing file ${file}:`, err);
          return;
        }
        console.log(`Updated imports in ${file}`);
      });
    });
  });
});
