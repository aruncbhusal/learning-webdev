/* In this final project for the ExpressJS part, we'll have to create an application that allows us to see secret.html
but that is only if we've given it the correct password. The html files are already given
The package.json file is already there, we just need to install the packages there and I need to then start working on the project */

// The first thing to do here is to set up a basic structure for the Express app with import, app initialization and listen done
import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;
const dirname__ = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({ extended: true }));
// bodyParser is now bundled with express so we can simply use express.urlencoded instead to have the same functionality.

/* Maybe I too should use my own authentication middleware beacuse that is a better practice for later */
var isAuthorized = false;
app.use((req, res, next) => {
    if (req.body.password === 'ShowMeSecret') {
        isAuthorized = true;
    } else {
        isAuthorized = false;
        // I tried to run the server with else clause left out because I thought it would be false anyway
        // but since the server is ruuning continuously, the value of isAuthorized never becomes false after once being true
        // And we need to make it false ourselves once it is true. So either inside the if isAuthorized, we should make it false
        // before next person can ask for it, else just flag for each request, like this.
    }
    next();
});

// Now next our job is to display the form on the home endpoint
app.get('/', (req, res) => {
    res.sendFile(dirname__ + '/public/index.html');
});

// Final job for us is to have a post request to the "/check" endpoint where the other html is sent, is the password matches
// First let's set up the middleware above and finally create the handler
app.post('/check', (req, res) => {
    if (isAuthorized) {
        res.sendFile(dirname__ + '/public/secret.html');
        // I could have a redirect for it to go to /secret then display it but I'll just add the redirect for the wrong password condition
    } else {
        // In the course solution from what I saw in the demo, she sends the index file here
        // But I want to add a redirect here and let the home page handle it itself. I'll need to look for a redirect method
        res.redirect(303, '/');
        // This was easy, I just had to look at MDN docs about which status code to prefer, and chose whichever was closest
    }
});

app.listen(3000, () => {
    console.log(`The server is listening on port ${port}`);
});

/* In the solution.js file, she again instead created a middleware which checks the password, and sets a boolean for the handler
The handler than makes the if/else decision using the boolean. Also she has mentioned res.redirect in the comment there as well */
