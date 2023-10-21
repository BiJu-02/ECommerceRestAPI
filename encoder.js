const prompt = require('prompt-sync')({sigint: true});

while (true) {
    const inputStr = prompt('enter string to be encoded(Q/q to exit): ');
    if (inputStr.toLowerCase() === 'q') { break; }
    console.log(encodeURIComponent(inputStr));
}