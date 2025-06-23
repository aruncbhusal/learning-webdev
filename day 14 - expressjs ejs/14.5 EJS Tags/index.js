/* In EJS, we have different tags we can use for templating, these always start and end with <% and %>
1. <%= variable %>  =>  This simply outputs the value of the variable or the JS enclosed into the spot it is put
2. <% expression %>  =>  This executes the JS expression enclosed within, but does not give any output, used for control, console
3. <%- include("...") %>  =>  This is used to include other files inside the current one
It can be used when we have a main part of the website and some other parts like header and footer. The header and footer don't change
But we want the main part different depending on the content in it. In those cases, we use this
3b. <%- <p> content </p> %>  =>  This can also be used to add html tags
4. <%% %%>  =>  This is used to escape the <% %> i.e. display it, rather than it being executed as EJS
5. <%# Commment %>  =>  This is used to write a comment

Based on this information, our task here is to ensure the index.ejs is able to display as required
The get here was already written for us, we just need to install modules, and then ensure the index.ejs displays as expected */

import express from 'express';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    const data = {
        title: 'EJS Tags',
        seconds: new Date().getSeconds(),
        items: ['apple', 'banana', 'cherry'],
        htmlContent: '<strong>This is some strong text</strong>',
    };
    res.render('index.ejs', data);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
