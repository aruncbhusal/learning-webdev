/* In this project we need to write the index file from scratch, but the styling and other stuff is already given
There are hints given but all the steps are things we've already done in the past modules so I'll do it blind
The ejs file, styling, images are all given as a part of the project and I just have to complete this file
Let's start with the installation and set up the project */

import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;
const API_URL = 'https://secrets-api.appbrewery.com/random';

app.use(express.static('public'));

app.get('/', async (req, res) => {
    const response = await axios.get(API_URL);
    res.render('index.ejs', {
        secret: response.data.secret,
        user: response.data.username,
    });
});

app.listen(port, () => {
    console.log(`Server is now listening on port ${port}`);
});

// Simple enough, didn't need to touch any other file for this either.
