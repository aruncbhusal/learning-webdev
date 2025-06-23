/* A middleware is something that is between the client's request and the routes that are designated to handle the requests, on the server
It can be used to process the requests before they are handled, verify and authenticate the requests, etc
For our purposes, we will use a middleware called body-parser
Since I got the starting files from the course, it comes with a package.json but no node modules installed yet
I need to use 'npm install' in order to install the dependencies in the package.json */

/* First let's dissect the code we have so far
We import express and start the app on port 3000. We have an endpoint at "/"  which takes a get request
On the get request it sends a fiel using sendFile method. Since our server may be anywhere in the cloud,
we don't know where our current folder is, so we don't have a path. We can use dirname function from native module path
we save the path to the current folder to a constant __dirname, and we find the URL/path using the fileURLToPath function in url
using that, we then append the current folder path with the path to the index.html file, which contains a form

Now our task here is to install body-parser, bring it here, and use it to parse a url encoded request, like the one from the form
Then we need to write a post request handler for the route "/submit" and log the user's outputs there */

import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
// Let's first import body-parser
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

// Now we need to use the bodyParser middleware in our app
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Finally let's write a post request endpoint to log out the data (I'm just copying atp, not good)
app.post('/submit', (req, res) => {
    // This takes the entire request and only gives us a dict containing names of input fields, and values provided by the user
    // Without using body parser, req.body is undefined, because it is what created this property for the request
    console.log(req.body);
});
/* We can either use Postman to simulate the POST request on the form, or use the form on the browser directly
When using postman we need to select www-form-urlencoded as our request type, because that is what we're handling here */

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
