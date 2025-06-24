/* This project was to be built entirely from scratch so I'll have to think about how to handle this
The features we want are:
1. Post Creation: Users should be able to create new posts.
2. Post Viewing: The home page should allow the user to view all their posts.
3. Post Update/Delete: Users should be edit and delete posts as needed.
3. Styling: The application should be well-styled and responsive, ensuring a good user experience on both desktop and mobile devices.

But she's not yet covered dynamic endpoints so we'll need to just render everything inside a "/post" endpoint
Also authentication hasn't been taught yet so we don't need that
This one is clearly going to be difficult to complete in a short time, but well let's go anyway */

import express from 'express';
// This time I'll avoid using body parser and handle with express
import ejs from 'ejs';

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Since we don't have a database, the information will not persist, but we can create a list for the current session
// Also since we don't have an option to load only the post we need, I'll just load everything at once inside the index
const posts = [];

function Post(id, title, body) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.author = 'ACB'; // Hardcoding this for now
    this.date = new Date().toDateString();
}

app.get('/', (req, res) => {
    for (let i = 0; i < posts.length; i++) {
        posts[i].id = i;
    }
    res.render('index.ejs', {
        posts: posts,
    });
});

app.get('/create', (req, res) => {
    res.render('form.ejs', {
        post: new Post(posts.length, '', ''),
    });
});

/* Since we don't know what post the user clicked on since we have no way to send to the server,
this blog cannot handle more than one post, even so it will only give the last blog that was posted, no matter which one is selected
I wonder why she asked for this project before even covering API calls
Okay as I said above, I will instead just show all the blogs and complete content inside the homepage, for ease
Since every post has its own form wich delete and edit buttons, I should be fine */

app.post('/submit', (req, res) => {
    const postId = req.body['post-id'];
    if (postId >= posts.length) {
        const newPost = new Post(
            postId,
            req.body['post-title'],
            req.body['post-body']
        );
        posts.push(newPost);
    } else {
        posts[postId].title = req.body['post-title'];
        posts[postId].body = req.body['post-body'];
    }
    res.redirect('/');
});

app.post('/edit', (req, res) => {
    res.render('form.ejs', {
        post: posts[req.body['post-id']],
    });
});

app.post('/delete', (req, res) => {
    // To delete we need to use splice function
    posts.splice(req.body['post-id'], 1);
    res.redirect('/');
});
// I was using res.body instead of req.body for quite some time, wow.

// Since we've gone so far, I think I should also have a 'post' endpoint for this
// app.post("/post", (req, res) => {
// })
// On second thought, without dynamic endpoints it is just a waste of time trying to make it work, and style it well

app.listen(port, () => {
    console.log(`Server now listening on port ${port}`);
});
