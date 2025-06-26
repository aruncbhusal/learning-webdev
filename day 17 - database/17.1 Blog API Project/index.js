/* In this final challenge for creating APIs, we need to create an API here which serves the server.js
The server.js is running a code for the backend of a blog site, and it makes API requests to this server
We need to add all functionality, GET, POST, PATCH, DELETE
But since we need to have two servers running at the same time, they must have different ports
So this one is running at 4000 */

import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 4000;

// In-memory data store
let posts = [
    {
        id: 1,
        title: 'The Rise of Decentralized Finance',
        content:
            'Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.',
        author: 'Alex Thompson',
        date: '2023-08-01T10:00:00Z',
    },
    {
        id: 2,
        title: 'The Impact of Artificial Intelligence on Modern Businesses',
        content:
            "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
        author: 'Mia Williams',
        date: '2023-08-05T14:30:00Z',
    },
    {
        id: 3,
        title: 'Sustainable Living: Tips for an Eco-Friendly Lifestyle',
        content:
            "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
        author: 'Samuel Green',
        date: '2023-08-10T09:15:00Z',
    },
];

let lastId = 3;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Write your code here//

//CHALLENGE 1: GET All posts
// We need to look at how the server is configured, looks like I just need to send the array
app.get('/posts', (req, res) => {
    res.json(posts);
    // Simple enough
});

//CHALLENGE 2: GET a specific post by id
// This is needed for editing a post, let's give it the post
app.get('/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const reqPost = posts.find((post) => post.id === id);
    if (!reqPost) {
        res.status(404).json({
            error: `No post found with id ${id}`,
        });
    } else {
        res.json(reqPost);
    }
});

//CHALLENGE 3: POST a new post
app.post('/posts', (req, res) => {
    lastId++;
    const newPost = {
        id: lastId,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        date: new Date().toISOString(),
    };
    posts.push(newPost);
    res.json(posts.slice(-1));
});

//CHALLENGE 4: PATCH a post when you just want to update one parameter
app.patch('/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const postToPatch = posts.find((post) => post.id === id);
    if (!postToPatch)
        return res.status(404).json({
            error: `No post found with id ${id}`,
        });
    // We can apparently also return this, didn't know

    const replaceWith = {
        id: postToPatch.id,
        title: req.body.title || postToPatch.title,
        content: req.body.content || postToPatch.content,
        author: req.body.author || postToPatch.author,
        date: postToPatch.date,
    };
    // I was worried because the content editing was not working, then realized no name was given for textarea
    // In the modify.ejs file, probably because the things meant to be edited are just hte title and author
    // I could add a name and allow it to be updated too. You know what, maybe I should. I will.
    const location = posts.findIndex((post) => post.id === id);
    posts[location] = replaceWith;
    res.json(replaceWith);
});

//CHALLENGE 5: DELETE a specific post by providing the post id.
app.delete('/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const postIndex = posts.findIndex((post) => post.id === id);
    if (postIndex < 0) {
        res.status(404).json({
            error: `No post found with id ${id}`,
        });
    } else {
        const post = posts[postIndex];
        posts.splice(postIndex, 1);
        res.json(post);
    }
});

app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
});

// Some changes I've integrated from course solution:
// Added if (post) check to see if the post a user wants to do anything with actually exists
// Added a lastID variable because if a post at id 1 is deleted, the length+1 for 2 post blog is 2, but another blog already has id 2
// Apparently there already was a lastID, I just needed to use it
