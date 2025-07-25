// In order to work with the share my place app and send a request to this backend server, we need to create an app that accepts json
// And it should also give out json data
const bodyParser = require('body-parser');
const express = require('express');

// We need to also import the location.js file
const locationRouter = require('./routes/location');

const app = express();

// We need to use the json method here since we're getting json data
app.use(bodyParser.json());

// CORS(Cross Origin Resource Sharing) is not allowed normally on a server i.e. it only allows requests to come from the same server/origin
// But since we're trying to call from the frontend, it's giving an error. We can instead change the CORS settings for the server to allow
// For that we can add a middleware to the express app
app.use((req, res, next) => {
    // To change CORS policy, we need to first set headers to the response before making locationRouter handle the logic
    res.setHeader('Access-Control-Allow-Origin', '*');
    // By setting origins allowed as *, any origin can access the backend, we can also simply add the location of frontend
    // Next we can also set what methods are allowed to be sent, OPTIONS is sent to get by the browser as well for info gathering
    res.setHeader('Access-Control-Allow-Method', 'GET, POST, OPTIONS');
    // Similarly, we can also allow specific headers
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Similarly, we also need to add another middleware for the location file
app.use(locationRouter);
// Now we can modify the frontend app so that it makes a reques to this server

app.listen(3000);
// Now our app will listen here, but we need to handle the actual requests, which we can do in another file in folder called 'routes'
