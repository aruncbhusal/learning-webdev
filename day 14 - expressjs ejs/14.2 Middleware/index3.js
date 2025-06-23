/* We can also create our own middleware and use it in our app.
In this challenge, the job is to create a middleware function called logger.
The code to use it is already there, I just need to add a function that logs out the request method and the request url */

import express from 'express';

const app = express();
const port = 3000;

app.use(logger);

app.get('/', (req, res) => {
    res.send('Hello');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// Let's create the function here, it should have arguments request, response and next
function logger(req, res, next) {
    console.log(`Request Method: "${req.method}", Request URL: "${req.url}"`);
    next();
    // After our middleware has handled the request, we need to call the next function that was passed to it
    // This way the control goes to the handlers which can then do their job
}
