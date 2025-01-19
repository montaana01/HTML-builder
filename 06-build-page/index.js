const fs = require("node:fs");
const path = require("node:path");

const distFolder = path.join(__dirname, "project-dist");
const templateFile = path.join(__dirname, "template.html");
const componentsFolder = path.join(__dirname, "components");
const stylesFolder = path.join(__dirname, "styles");
const assetsFolder = path.join(__dirname, "assets");
const outputHTML = path.join(distFolder, "index.html");
const outputCSS = path.join(distFolder, "style.css");
const outputAssets = path.join(distFolder, "assets");

function buildHTML() {
  fs.promises.readFile(templateFile, "utf8")
    .then((template) => {
      return fs.promises.readdir(componentsFolder, { withFileTypes: true })
        .then((files) => {
          const componentPromises = files
            .filter(file => file.isFile() && path.extname(file.name) === ".html")
            .map((file) => {
              const tag = `{{${path.parse(file.name).name}}}`;
              const filePath = path.join(componentsFolder, file.name);

              return fs.promises.readFile(filePath, "utf8")
                .then(content => ({ tag, content }));
            });

          return Promise.all(componentPromises)
            .then(components => {
              for (const { tag, content } of components) {
                template = template.replace(new RegExp(tag, "g"), content);
              }
              return template;
            });
        });
    })
    .then(finalHTML => {
      return fs.promises.writeFile(outputHTML, finalHTML, "utf8");
    })
    .then(() => {
      console.log("HTML file successfully built!");
    })
    .catch((err) => {
      console.log(`Error while building HTML: ${err}`);
    });
}

function buildCSS() {
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
      return fs.promises.writeFile(outputCSS, bundleCSS, "utf8");
    })
    .then(() => {
      console.log("CSS file successfully built!");
    })
    .catch((err) => {
      console.log(`Error while building CSS: ${err}`);
    });
}

function copyAssets(src, dest) {
  fs.promises.mkdir(dest, { recursive: true })
    .then(() => fs.promises.readdir(src, { withFileTypes: true }))
    .then((entries) => {
      const copyPromises = entries.map((entry) => {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
          return copyAssets(srcPath, destPath);
        } else {
          return fs.promises.copyFile(srcPath, destPath);
        }
      });

      return Promise.all(copyPromises);
    })
    .then(() => {
      console.log(`Assets successfully copied to ${dest}`);
    })
    .catch((err) => {
      console.log(`Error while copying assets: ${err}`);
    });
}

(() => {
  fs.promises.mkdir(distFolder, { recursive: true })
    .then(() => {
      console.log("Building project");
      buildHTML();
      buildCSS();
      copyAssets(assetsFolder, outputAssets);
    })
    .catch((err) => {
      console.log(`Error while creating project-dist folder: ${err}`);
    });
})();
