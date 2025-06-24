/* It is very common that we want to access an external API from our server to load up some data/resource
In those cases, we can use the node "https" native module
THere we have multiple steps for getting the response by giving options object, filling a data chunk until response ends
Then after response ends we parse the JSON, and if there's any error while parsing, we handle the error
If there was an error during the request, like a 404, We handle that error as well, before ending the request callback
This is a lot of steps, we can instead rely on a npm module called axios which handles it for us, and lets us do it in few steps
The code for that is already given to us for the get method
She just glanced over the fact that it's an async/await process though, thankfully I'm not oblivious, but a newbie would be lost

Anyway, let me solve the challenge by taking care of every step along the way */

import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Step 1: Make sure that when a user visits the home page,
//   it shows a random activity.You will need to check the format of the
//   JSON data from response.data and edit the index.ejs file accordingly.
app.get('/', async (req, res) => {
    try {
        const response = await axios.get(
            'https://bored-api.appbrewery.com/random'
        );
        const result = response.data;
        console.log(result);
        // Our job here lies in the index.ejs file, this route is already handled for the request part
        res.render('index.ejs', { data: result });
    } catch (error) {
        console.error('Failed to make request:', error.message);
        res.render('index.ejs', {
            error: error.message,
        });
    }
});

app.post('/', async (req, res) => {
    // Step 2: Play around with the drop downs and see what gets logged.
    // Use axios to make an API request to the /filter endpoint. Making
    // sure you're passing both the type and participants queries.
    // Render the index.ejs file with a single *random* activity that comes back
    // from the API request.
    try {
        const response = await axios.get(
            `https://bored-api.appbrewery.com/filter?type=${req.body.type}&participants=${req.body.participants}`
        );
        const result = response.data;
        const randomRes = result[Math.floor(Math.random() * result.length)];
        // Now I might have received a list, but I need to select a random activity from the list so let's do that
        res.render('index.ejs', { data: randomRes });
    } catch (error) {
        // Step 3: If you get a 404 error (resource not found) from the API request.
        // Pass an error to the index.ejs to tell the user:
        // "No activities that match your criteria."
        console.log('The request failed: ', error.message);
        // Idk what she means by "if you get a 404 error", how do I know what the error code evern was
        // And does she mean to say that I shouldn't handle other errors? I'll look around and solve it my way
        if (error.response.status === 404) {
            res.render('index.ejs', {
                error: 'No activities match your criteria.',
            });
        } else {
            res.render('index.ejs', {
                error: error.message,
            });
        }
        // This is what I ended up with. This should be the finished project.
        // Surprisingly, in the solution video, she did mention that we could handle different error codes differenly
    }
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
