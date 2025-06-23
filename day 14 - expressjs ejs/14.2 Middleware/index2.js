/* A middleware can be used for all sorts of purposes: pre-processing, authentication,logging, etc.
The body-parser middleware was used for pre-processing the request, but we have another very popular middleware called Morgan
This middleware is used for logging the request details, it is executed before the request reaches the handler.

Our task here is to install it, and use it for the logging process, by looking at the docs and options available */

import express from 'express';
// First let's import the downloaded module, start the nodemon server
import morgan from 'morgan';

const app = express();
const port = 3000;

app.use(morgan('combined'));
/* The function takes two parameters, but we can choose to not give a function that is used for format
The parameter we passed is a predefined format string, there are many predefined formats like common, dev, short, tiny
But combined is the standard, and we can also pass options like immediate (log line written on request instead of on response),
skip (to skip logging on certain conditions), stream (to log somewhere else instead of console i.e. process.stdout) */

// After adding this, we can now get a log on the console every time a request is made to the server.

app.get('/', (req, res) => {
    res.send('Hello');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
