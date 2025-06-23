/* In the frontend code we've written, we include various styles and scripts using the relative paths
But using them in our ejs files doesn't work, because they don't know where the path is
In order to make it work, we need to arrange it in the node way i.e. static files (images, css, etc) in a "public" folder
Then the folder can be set as static using a middleware, finally they can be referenced

Also we may have repititive content, like these style imports and navbars, we can reduce the redundancy
For this, we use the templating with partials <%- include() %> we used in the last module
It lets us place parts of the site like headers and footers

In this challenge, we just have to use what we've learned so far to complete the steps given for us.
As usual, I installed npm packages, and the app skeleton is given, now I just need to add all endpoints */

import express from 'express';

const app = express();
const port = 3000;

/* Write your code here:
Step 1: Render the home page "/" index.ejs
Step 2: Make sure that static files are linked to and the CSS shows up.
Step 3: Add the routes to handle the render of the about and contact pages.
  Hint: Check the nav bar in the header.ejs to see the button hrefs
Step 4: Add the partials to the about and contact pages to show the header and footer on those pages. */

// Second step
app.use(express.static('public'));

// First step:
app.get('/', (req, res) => {
    res.render('index.ejs');
    // This method takes a path relative to the views folder so since index is directly inside, we could use it directly
    // Also the include function inside the EJS file also takes a path relative to views
});

// Third step:
app.get('/about', (req, res) => {
    res.render('about.ejs');
});

app.get('/contact', (req, res) => {
    res.render('contact.ejs');
});

// For the fourth step, I'll have to edit both about and contact .ejs files

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
