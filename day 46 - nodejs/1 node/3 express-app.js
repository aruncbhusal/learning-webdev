// In order to use ExpressJs, we need to first initialize a npm project in this directory using 'npm init' and continuing until created
// Then we can install the Express package using 'npm install --save express'
// In order to use Express we will need to import it
const express = require('express');
const bodyParser = require('body-parser');

// Similarly we can create a server by creating an app object using the express module
const app = express();

// Since we're using ejs, we need to also set view engine and views for where to find the template file
app.set('view engine', 'ejs');
app.set('views', 'views');

// After installing bodyParser and importing it, we can set it as a middleware in our app by just using the urlencoded method
app.use(bodyParser.urlencoded({ extended: false }));

// Since Express is a middleware-driven framework where the request and response are handled by one middleware after another,
// Each being able to work with the request, modify it, send response, etc, or pass the execution to the next middleware
// We can create such a thing ourselves by using the use method
app.use((req, res, next) => {
    // We get sent the request and response as parameters like with normal http, but these have additional functionalities
    res.setHeader('Content-Type', 'text/html');
    // Now in order to send the request and response from here to the next middleware, we can use the next argument, which is a function
    next();
});

// Now we can add another middleware that sends the actual response
app.use((req, res, next) => {
    // The response object has a send method to send the response directly
    // res.send('<h1>Hello from Express</h1>');

    // We can implement the form here as well, for that we need to parse the user supplied data using a library called body-parser for ease
    // After adding bodyParser middleware we can now get the user passed name from the body
    let username = req.body ? req.body.username : 'Unknown User';
    // res.send(
    //     `<h1>Hello ${username}</h1><form method="POST" action="/"><input type="text" name="username" id="username"/><input type="submit"></form>`
    // );

    // Instead of sending html from here we can create a template for the html and insert data into that file using library like ejs
    // We can install the library and then create a new folder, let's call it 'views' by convention, and have an index.ejs file which has html
    // But since it is a templating engine, we can add variables inside it as well, using <%= %> we can add a value/expression inside there
    // It will be rendered as a normal html page, and to render it we simply need to use the render method with filename and parameters
    res.render('index', {
        user: username,
    });
    // We can read more about ejs from https://ejs.co/
});

// We need to start listening, and we can do it with the listen method again
app.listen(8484);

app.use((req, res, next) => {
    let username = req.body.username || 'Unknown User';
    res.render('index', {
        user: username,
    });
});

// But like in the share my place project, we can alos send JSON data, as sent by Google in that project
// That will be our practice
