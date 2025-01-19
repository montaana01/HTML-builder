const fs = require('node:fs');
const path = require('node:path');

const stylesFolder = path.join(__dirname, 'styles');
const distFolder = path.join(__dirname, "project-dist");
const outputFile = path.join(distFolder, 'bundle.css');

(() => {
  console.log("Building bundle.css file\n");

  fs.promises.readdir(stylesFolder, { withFileTypes: true })
    .then((files) => {
      const cssFiles = files
        .filter((file) => file.isFile() && path.extname(file.name) === ".css")
        .map((file) => path.join(stylesFolder, file.name));

      const cssPromises = cssFiles.map((file) => fs.promises.readFile(file, "utf8"));
      return Promise.all(cssPromises);
    })
    .then((styles) => {
      const bundleCSS = styles.join("\n");
      return fs.promises.writeFile(outputFile, bundleCSS, "utf8");
    })
    .then(() => {
      console.log(`CSS file written in "${outputFile}"`);
    })
    .catch((err) => {
      console.log(`Error while writing CSS-file: ${err}`);
    });
})();
