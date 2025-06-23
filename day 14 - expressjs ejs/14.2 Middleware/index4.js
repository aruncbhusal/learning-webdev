/* Final challenge now is to combine all the things we've learned previously and make use of them to complete the Band Name generator
It should show the form in the index.html file inside public, then it should take the post request and handle it.
Finally it should send a response with the band name */

import express from 'express';
// First task will be to import both body-parser and morgan, morgan is not important, but let's do it either way
import bodyParser from 'body-parser';
import morgan from 'morgan';
// Not to forget we also need the file location parser
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;
// Now let's get the path here
const dirname__ = dirname(fileURLToPath(import.meta.url));
// I'm doing this staight from memory, and trying to make sense of things at the same time

// app.use((req, res, next) => {
//   bodyParser.urlencoded({ extended: true });
//   morgan('tiny');
//   next();
// });
// I asked ChatGPT before running the server, and I can just have multiple app.use lines to use multiple midllewares, nice

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
// I'm logging it before the body is parsed, the order doesn't matter here anyway

// Next I need to create both the endpoints
app.get('/', (req, res) => {
    res.sendFile(dirname__ + '/public/index.html');
});

app.post('/submit', (req, res) => {
    // Since we're using bodyParser, we should have everything in our response body
    const bandName = req.body.street + req.body.pet;
    // I could add a processing step to make the first letter capitalized, but don't want to complicate things
    res.send(
        `<h1>Your Band Name</h1> <p>Your band name is <strong>${bandName}</strong>.</p>`
    );
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

/* In the course solution, she had put the logic for generating the band name inside a middleware
The order of middlewares matters very much, because if the middleware that makes use of bodyParser i.e. main logic function, was before bodyParser
It would result in an undefined error, because bodyParser hasn't yet added the body attribute to the request, and we're trying to access it in our logic
But my method is fine as is, because the logic occurs AFTER the body parses has done its job */
