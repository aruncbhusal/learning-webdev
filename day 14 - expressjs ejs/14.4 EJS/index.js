/* In the past modules, when working with Express and Node, we worked with static files, just sending a .html or html text
But we may want dynamic behavior or our website, like passing a resource to be shown to the user
We CAN do it by just sending the dynamic content using res.send and including the whole HTML code there
But since we want to separate our concerns, we can use templating lnaguages to do it for us
There are many templating languages, twig for PHP, jinja for python, and the most popular is EJS (Embedded JS) for JavaScript */

/* The provided file has solution, but we'll create it from scratch without looking at it
We have a folder called views. A HTML file with EJS is saved as .ejs and it needs to be passed using render method, rather than sendFile
In that method, we can specify a JS object which contains the things to be passed to the template .ejs file
Let's first install Express and EJS, as well as extension: EJS Language Support in VS Code
Now we can start with a basic Express app.
Our task here is to use getDay() method to give advice based on whether it's a weekday or a weekend */

import express from 'express';
import ejs from 'ejs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;
const dirname__ = dirname(fileURLToPath(import.meta.url));

let whichDay, doWhat;

app.use((req, res, next) => {
    const today = new Date();
    if (today.getDay() === 0 || today.getDay() === 6) {
        whichDay = 'the weekend';
        doWhat = 'have some fun';
    } else {
        whichDay = 'a weekday';
        doWhat = 'work hard';
    }
    next();
});

app.get('/', (req, res) => {
    res.render(dirname__ + '/views/index.ejs', {
        whichDay: whichDay,
        doWhat: doWhat,
    });
});

app.listen(port, () => {
    console.log(`The server is now running on port ${port}`);
});

/* Apparently ejs templates are already taken from views and we don't need to specify a directory. Welp */
