// JS is a hosted language so we just need the engine to be able to run it. Inside the browser it can also access Browser APIs to alter DOM,
// But with Node, the V8 JS Engine is extracted out of the browser, stripping away browser APIs but adding new ones like file system access

const userName = 'Clark';

// The console object is not a part of the engine but it is offered as an API in both browser and node environments
console.log(`Hi ${userName}!`);
// To run the JS code, we can sinmply use 'node <filename.js>' into the terminal.
// We were using Node unknowingly in the past module as well, with syntax like require, and running webpack commands
// We did that because Node can access files in the system so it is used as a web server, while browser side JS can't do so.

// Most Browser APi features, like setTimeout and more, are offered as APis by Node as well
// But for other features, we need to import them, even if they are a part of nodejs itself
// An example is the fs module which works with the file system i.e. reading and writing into a file
// We can import it using the require function
const fs = require('fs');

// In order to open a file to read it, we simply use readFile
fs.readFile('imp-file.txt', (err, data) => {
    // It gives two parameters, one is error, and one is data, which is stored in a buffer
    if (err) {
        console.log(err);
    } else {
        console.log(data.toString());
        // We need to use toString because data is a buffer value
    }
});

// We can similarly write into the file using writeFile
fs.writeFile('imp-file.txt', 'This is a very important data.', (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Written to file!');
    }
});
