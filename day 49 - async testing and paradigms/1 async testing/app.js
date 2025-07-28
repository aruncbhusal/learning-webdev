const { printTitle } = require('./util');

const button = document.querySelector('button');

// We want to test the printTitle function, but since this file contains global scope code as well, we can't export from here
// Because when trying to import from this file, the whole file is loaded first, running all code like the event listener, which breaks
// So we need to take the printTitle function, as well as its dependency loadTitle function to another file so we can export printTitle

button.addEventListener('click', printTitle);
