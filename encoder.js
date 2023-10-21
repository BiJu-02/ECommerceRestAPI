const prompt = require('prompt-sync')({sigint: true});
const inputStr = prompt('enter string to be encoded: ');
console.log(encodeURIComponent(inputStr));