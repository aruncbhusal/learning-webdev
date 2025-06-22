/* Node comes with functionalities built into it that can be used for different purposes like file system and network
We can see the documentation to learn more : https://nodejs.org/docs/latest/api/
The browser based JavaScript is not able to access files from the local computer, that would be a disaster.
But since Node is meant to run on the server, we need to be able to do that, we'll look at how this works in thsi one */

/* First we need to bring the native file system module into our application, there are two ways to do this but we'll use CJS(Common JS) */
// const fs = require('node:fs/promises');
/* I was using this line and then breaking my mind over not it not reading the file
If I was supposed to use 'fs' instead of promises, it may as well had told me that when I was trying to write, but it let me write
It just didn't let me read anything, weird. Anyway let's import the actual fs instead of following the docs for this line */
const fs = require('fs');
// We can bring any other native module this same way as well

/* Now next we can create a new file using fs.writeFile, we need to send the file name, the data, and callback function to handle errors*/
fs.writeFile('newTextFile.txt', 'This was written using Node.', (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});
// The callback function I simply copied from the docs. Now if we run this file, a new file called newTextFile is created in this same folder

/* Now we have a challenge, we need to modify that text file, then use the fs.readFile method to read the file and log it to the console.
This should be pretty simple as well. The readFile method has basically the same parameters, a location to the file, and a callback
This callback takes both an error as well as the data inside that file */
fs.readFile('newTextFile.txt', 'utf-8', (err, data) => {
    if (err) throw err;
    console.log(data);
});
// I also had to give it an option parameter for the encoding, because otherwise it logs a buffer string instead. Either utf8 or utf-8 works
