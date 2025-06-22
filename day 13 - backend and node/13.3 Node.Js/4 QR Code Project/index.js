/* In this final project for this module, we need to make a QR code generator which produces a qr-img as well as a text file
The instructions from the course are given below. I will then start working on the project with a clean slate, the way it was given


1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

// First we need to initialize npm for this folder, and then change the package type to module
// During initialization, we can use 'npm init -y' to just say yes to eveyr question asked, and create the file instantly
// Also, we can initialize npm AFTER installing everything as well. No problems.
// Then we'll install both the inquirer and qr-image packages, and use them one by one to create the qr generator

/* Let's first use the inquirer module to add a prompt to the command line to solicit a link from the user
From the site, we can see it is no longer being developed, and @inquirer/prompts is preferred, but I'll use the original one for now */

import inquirer from 'inquirer';
import { image } from 'qr-image';
// Apparently we're using an object called qr from this module, but because of the way the example code was structured
// I thought we were just storing whatever we got from the function into a variable called "qr"
// Anyway, mine works but this seems to be the course's way:
// import qr from 'qr-image';
import fs from 'fs';

// I'll try to mimic an example from the inquirer's page
inquirer
    .prompt({
        type: 'input',
        name: 'url',
        message: 'Enter the URL to convert to QR',
    })
    .then((answer) => {
        // This should be the part where the supplied URL is used to create the QR. Let's see if it's working first
        // console.log(answer.url);

        /* Okay now we know where the replied message is, we can install and then use the qr-image package
        Let me try to use the example code to see if it works, since the example was given in CJS and not ESM */
        var qr_img = image(answer.url, { type: 'png' });
        // I didn't notice this but the default type seems to be png so we didn't actually need to specify that here
        qr_img.pipe(fs.createWriteStream('qr-url.png'));

        fs.writeFile('url.txt', answer.url, (err) => {
            if (err) throw err;
            console.log('The file was created successfully.');
        });
    })
    .catch((error) => {
        if (error.isTtyError) {
            console.log(
                "Prompt couldn't be rendered in the current environment."
            );
        } else {
            throw error;
        }
    });

/* Almost in one shot. She hasn't told us anything about the async used in this one, but just threw it out there like a "figure it out"
Guess I did figure it out, thanks to me having done async before, but I don't know how someone who's just starting webdev would be able to do this
Let's see what she has to say.*/

/* Okay at the end of that, she explained literally nothing, she just did exactly what I did, well almost,
she even used const to store the url, when she has never mentioned it in the past modules.
If this is the depth we're dealing with, I might need to invest more time into learning these things deeper myself later on */
