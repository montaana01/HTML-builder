let fs = require('fs');
const path = require('node:path');

let pathToFile = path.join('./01-read-file/text.txt');

const readStream = fs.createReadStream(pathToFile);

readStream.on('data', (data) => {
  console.log(data.toString());
});
readStream.close();
