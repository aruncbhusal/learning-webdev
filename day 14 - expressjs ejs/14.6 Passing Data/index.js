/* We can pass data from the server to the EJS template usig the options like before,
but what if we don't supply any data, how do we ensure it doesn't crash
We may think of using if(data) but that doesn't work, since it is EJS, not vanilla JS
and it doesn't check for scope of data, and it is bundled into the object we send, stored as locals
So we need to instead use locals.data to check for it

In order to pass data from the EJS to the server, it can be done simply using a form 

In this challenge, we need to show a form (to which we need to add a heading),
the data passed by the form should be used to calculate the number of letters in the name,
this number of letters output then replaces the heading of the homepage */

import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

var nameLength;

app.get('/', (req, res) => {
    res.render('index.ejs', {
        nameLength: nameLength,
    });
});

app.post('/submit', (req, res) => {
    nameLength = req.body['fName'].length + req.body['lName'].length;
    res.redirect('/');
});
/* In her solution, she has defined a const inside this endpoint, and called the render method from here
So the page was displayed inside /submit route. But in the demo it was being displayed in the / route
So I broke the functionality trying to redirect, and setting a variable in the global scope
In what I did, the nameLength variable is set to whatever the last person who filled the form made it
I think her solution is more robust in terms of functionality, but I wanted it to feel more real */

/* After a conversation with GPT, my final verdict is that:
- this is not a code I would deploy, if I had no other idea I should just render it inside /submit
- Else I can use the express-session middleware to store session data then use it to render in / */

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
