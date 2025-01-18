const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const userListener = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const writeStream = fs.createWriteStream(path.join(__dirname, 'write.txt'));

console.log("Hello, User!\nWrite text below:\n");

userListener.on('line', (line) => {
  if (line.toLowerCase() === "exit") {
    userListener.close();
    return;
  }
  writeStream.write(`${line}\n`);
})

userListener.on("close", () =>{
  console.log("Bye bye! See you later!");
  writeStream.end();
})

process.on('SIGINT', () => {
  userListener.close();
});
