/* NPM(Node Package Manager) is an open source library of packages/modules we can use in our projects, and were written by other developers
It contains all sorts of packages that people created and uploaded so other people can use, and offer functionality that native modules might not
NPM is pre-installed with Node so we need to first use 'npm init' in the terminal in the current folder in order to start the process
This initiates a questionnaire we can fill to finally create a package.json file, which looks like a Javascript object.
It stands for JavaScript Object notation. This file contains the configuration for our npm project.
Now we're ready to install packages by going to npmjs.com and looking around
For an example we will instlal the 'sillyname' module which generates a random silly name.
In order to install we can use 'npm install <modulename>' or shorten install to just i */

/* After the installation is done, we can see a dependencies line being added into the .json file which contains name of the installed module
Apart from that, we then have a node_modules folder in the current folder which contains the files for the module installed */

/*

// This is the code from documentation we'll use verbatim:

// var generateName = require('sillyname');
// Since we're using modules we will need to change this to the import format
import generateName from 'sillyname';

var sillyName = generateName();
// We can then display the sillyname to the console:
console.log('The silly name is: ' + sillyName);

*/

/* Earlier we saw that there was another method to get hold of the native modules, apart from CJS (Common JS), which is the default
It is called ECMA Script Modules (ESM) and has been a part of node since version 12.
We can use the following method to import the modules rather than require it, using that method:
import <what to import> from "<modulename>";
But before we can import, we need to make changes to the configuration .json file.
We need to add a key called type and add a value called "module" since we are using modules instead of CommonJS */

/* Our challenge was to use the superheroes module to generate a superhero name, so as usual we need to install it then we can import */

import superheroes, { randomSuperhero } from 'superheroes';

// In her solution, she imported the superheroes object instead

// import superheroes from 'superheroes';
// console.log(`I am ${superheroes.random()}`);

// I tried this but it said there is no random function for the given object, which is clearly a string array
// Somehow her code gave the expected output. Wild

console.log(`I am ${randomSuperhero()}`);
// here we use the JavaScript string interpolation with backticks and inside them we can add a JS expression in ${} to separate from string
