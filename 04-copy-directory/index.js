const fs = require("node:fs");
const path = require("node:path");

const copyDirectory = path.join(__dirname, "files");
const pastDirectory = path.join(__dirname, "files-copy");

(() => {
  console.log(`Copying files from "${copyDirectory}" to "${pastDirectory}" directory`);
  fs.promises.mkdir(pastDirectory, { recursive: true })
    .then(() => {
        return fs.promises.readdir(copyDirectory);
    })
    .then(files => {
      const copyPastFiles = files.map(file => {
        return fs.promises.copyFile(path.join(copyDirectory, file), path.join(pastDirectory, file))
      });
    return Promise.all(copyPastFiles);
  })
  .then(() => {
    console.log("Files successfully copied");
  })
  .catch(err => {
    console.log(`Something went wrong: ${err}`);
  });
})();
