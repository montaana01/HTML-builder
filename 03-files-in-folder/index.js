const fs = require('node:fs');
const path = require('path');

const secretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolder,{ withFileTypes: true }, (err, files) => {
  if (err) {
    console.error("Error while getting secret information:", err);
  }
  console.log(`Files and folders in ${path.basename(secretFolder).toUpperCase()}:`);

  for (const file of files) {
    if (file.isFile()) {
      fs.stat(path.join(secretFolder, file.name), (err, stats) => {
        if (err) {
          console.error(`Error getting size for ${file.name}:`, err);
          return;
        }
        console.log(`${path.parse(file.name).name}-${path.extname(file.name).slice(1)}-${(stats.size / 1000).toFixed(2)} kb`
        );
      });
    }
  }
})
