/* Node is nto a framework, it is simply what allows web applications to be run outside of a browser
Because of that, it is broad in usage, even VS Code is developed using Node. So we need something more specialized for backend web dev.
The most popular backend framework on top of Node is ExpressJS. It makes the development process much faster and modular.
The front end is also referred as "Client-side" and backend as "server-side" so entire backend can be called a server
We need to create a server using Express and Node. */

/* The steps to get an Express server are:
1. Create a new directory for the project
2. Initialize npm
3. Install express module
4. Write the server side logic
5. Start the server */

import express from 'express';
const app = express();
const port = 3000;

/* After the server has run, we can see in the browser that it says cannot GET /, it is because our browser is making a request
There are different types of requests that can be made with HTTP (HyperText Transfer Protocol):
1. GET: This is when we want to request resources from a server
2. POST: This is when we want to send some resource to the server
3. PUT: This is when we want to modify something on the server by replacing it
4. PATCH: This is when we want to modify something on the server by only sending the part to "patch"
5. DELETE: This is to delete a certain resource from a server

Our browser here is requesting with GET, but we don't have a response set up yet, this is how we can do so: */
app.get('/', (req, res) => {
    // console.log(req);
    // When we log out the requst, we see a big list of things, but we can get the important bits using
    // console.log(req.rawHeaders);
    // This gives us information about the origin of the request, port, host OS, browser, etc

    // Since we want to send out a response to the user, we can simply use:
    res.send('<h1>Home Page</h1>');
    // We can send normal next, or HTML formatted text
});

/* We can use the app.get method from Express to handle a get request, since we need to handle on "/" we need to specify that
Then we can have a callback anonymous function which handles the request, it takes two parameters, the request and the response
The convention is to write req and res.
In order for our server to work, we need to restart it, for that we need to close it using Ctrl+C or kill the port using terminal
But restarting our server each time we change something is tedious
We can make it easier by installing and using nodemon, which monitors our server for any changes and restarts automatically
In order to install it globally, so that we can use it on any of our projects, we can simply use
npm i -g nodemon
Then to use it, we can simply replace "node index.js" with "nodemon index.js"
*/

/* After setting the homepage, we can now set up more endpoints
An endpoint is simply a location on our server the user wants to access, say a different page on a blog
A task here was to create enpoints for not only "/" but also "/about" and "/contact" */
app.get('/about', (req, res) => {
    res.send('<h1>About Me</h1> <p> I am Arun C Bhusal </p>');
});
app.get('/contact', (req, res) => {
    res.send(
        '<h1>Contact Me</h1> <a href="https://github.com/aruncbhusal/">My GitHub Profile</a>'
    );
});

/* When we make HTTP requests, we can send text, we can send HTML, and we can also send status codes with the request
See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status
We have five types of status codes:
1xx : Informational
2xx : Successful
3xx : Redirect
4xx : Client side error
5xx : Server side error
The specific codes can be seen in the docs.
When we write backend code, we might not have the time to create a front end for everything, but we need to test our endpoints
For such purposes, we can use an application called Postman where we can make requests to an end point and observe the responses
Let's first create some endpoints with different request types and status codes:
*/

app.post('/register', (req, res) => {
    // We can send a status code using:
    res.sendStatus(201);
});

app.put('/user/acb', (req, res) => {
    res.sendStatus(200);
});

app.patch('/user/acb', (req, res) => {
    res.sendStatus(200);
});

app.delete('/user/acb', (req, res) => {
    res.sendStatus(200);
});

/* Since a browser is to display HTML data, it is not suitable for testing these endpoints, so we should use an application like Postman */

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});
/* In the code above, we import express module, and create an app using it
We also need to specify the port to be listened on. Our computer/server can have many services/hardwares/softwares communicating with it.
In order for them all to be able to communicate without interfering with each other, we need to assign different ports to listen on
In our case, we create a constant for port 3000, then use app.listen to set it, and a callback that displays a message on success
We can see what ports our computer is currently listening on by using:
netstat -ano | findstr "LISTENING"
on windows, and
sudo lsof -i -P -n | grep LISTEN
on Linux/Mac, once we run our server using 'node index.js' it shows listening on port 3000
We can create a new terminal to see port opened from another terminal. The server can be accessed at localhost:3000 in the browser
localhost means that our local computer is acting like a server/host and the latter part is the port */
