/* The REST API is not only GET, but we have other request methods as well, which are all available in Axios as aliases
The post, put and patch aliases take three parameters, the url, data(body part of the form) and the config
The get and delete routs only take url and config, and we can see the docs to see which are optional, usually only url is mandatory

We have two methods of making a request, one is the traditional JS method by using .then() chaining after the get() or others
What it does is that it waits for the earlier one to complete before going to the then block
But in 2017 since ES8, async and await are being used, in which we can use await inside a function declared as async
Then the await line releases a promise and the next line waits until the promise is resolved, while other stuff are being performed

Our job here is to use the Bearer token from the last lesson to allow GET, POST, PUT, PATCH and DELETE requests through the form
By looking at the ejs file, I just found out that inside a form, we can add formaction attribute to buttons to specify diff routes
So in the blog project I did, I didn't really need two forms after all. Anyways, let's focus on this project and start */

import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
const API_URL = 'https://secrets-api.appbrewery.com';

// HINTs: Use the axios documentation as well as the video lesson to help you.
// https://axios-http.com/docs/post_example
// Use the Secrets API documentation to figure out what each route expects and how to work with it.
// https://secrets-api.appbrewery.com/

//TODO 1: Add your own bearer token from the previous lesson.
const yourBearerToken = 'a23a05a1-901b-4864-abfa-31fe7fc95a8c';
const config = {
    headers: { Authorization: `Bearer ${yourBearerToken}` },
};

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index.ejs', { content: 'Waiting for data...' });
});

app.post('/get-secret', async (req, res) => {
    const searchId = req.body.id;
    try {
        const result = await axios.get(
            API_URL + '/secrets/' + searchId,
            config
        );
        res.render('index.ejs', { content: JSON.stringify(result.data) });
    } catch (error) {
        res.render('index.ejs', {
            content: JSON.stringify(error.response.data),
        });
    }
});
// I put my bearer token and was confused because it kept showing "Bad Request."
// Turns out I had forgotten to restart the server, smh

app.post('/post-secret', async (req, res) => {
    // TODO 2: Use axios to POST the data from req.body to the secrets api servers.
    const body = {
        secret: req.body.secret,
        score: req.body.score,
    };
    try {
        const result = await axios.post(API_URL + '/secrets/', body, config);
        res.render('index.ejs', { content: JSON.stringify(result.data) });
    } catch (error) {
        res.render('index.ejs', {
            content: JSON.stringify(error.response.data),
        });
    }
});
// Yet again I was scratching my head, forgetting that Axios handles the object to JSON conversion itself
// I kept using JSON.stringify when sending the body and that made everything null

app.post('/put-secret', async (req, res) => {
    const searchId = req.body.id;
    // TODO 3: Use axios to PUT the data from req.body to the secrets api servers.
    const body = {
        secret: req.body.secret,
        score: req.body.score,
    };
    try {
        const result = await axios.put(
            API_URL + '/secrets/' + searchId,
            body,
            config
        );
        res.render('index.ejs', { content: JSON.stringify(result.data) });
    } catch (error) {
        res.render('index.ejs', {
            content: JSON.stringify(error.response.data),
        });
    }
});

app.post('/patch-secret', async (req, res) => {
    const searchId = req.body.id;
    // TODO 4: Use axios to PATCH the data from req.body to the secrets api servers.
    const body = {};
    if (req.body.secret.length > 0) {
        body['secret'] = req.body.secret;
    }
    if (req.body.score.length > 0) {
        body['score'] = req.body.score;
    }
    // I don't know if just putting them both would work because they would be empty otherwise
    try {
        const result = await axios.patch(
            API_URL + '/secrets/' + searchId,
            body,
            config
        );
        res.render('index.ejs', { content: JSON.stringify(result.data) });
    } catch (error) {
        res.render('index.ejs', {
            content: JSON.stringify(error.response.data),
        });
    }
});

app.post('/delete-secret', async (req, res) => {
    const searchId = req.body.id;
    // TODO 5: Use axios to DELETE the item with searchId from the secrets api servers.
    try {
        const result = await axios.delete(
            API_URL + '/secrets/' + searchId,
            config
        );
        res.render('index.ejs', { content: JSON.stringify(result.data) });
    } catch (error) {
        res.render('index.ejs', {
            content: JSON.stringify(error.response.data),
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// This one was simple enough, didn't even have to write it, just copy paste and value change
