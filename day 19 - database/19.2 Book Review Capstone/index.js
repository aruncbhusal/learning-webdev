/* In this capstone project, I'll be building everything from scratch, and my total time for this (hopefully) is 2 hrs
So I'm not expecting a visual and functional spectacle, but I'd at least want to add the features I want to.
I will incorporate the API part at the end. First let me make sure the app works on its own.
My target for Phase 1 is to be able to display all books and reviews, able to sort it by name, author, date added,
be able to add books, edit reviews, and delete books as well.
When sorting by date, I will sort by id, because that is reliable enough, and I don't want to deal with datetime types in SQL rn
Then in Phase 2 the goal is to add API-aided book searching and cover adding functionality */

import express from 'express';
// import axios from 'axios';
import pg from 'pg';

const app = express();
const port = 3000;
const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'review',
    password: 'postygresy',
    port: 5432,
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
await db.connect();

app.get('/', async (req, res) => {
    // Let's first get all the books from the db
    // But we also have to add sortability
    let books;
    let queryBy = 'id';
    if (req.query.sort && ['id', 'title', 'author'].includes(req.query.sort)) {
        queryBy = req.query.sort;
    }
    const query = `SELECT * FROM books ORDER BY ${queryBy} ASC`;
    try {
        const result = await db.query(query);
        books = result.rows;
    } catch (err) {
        console.log(err.stack);
    }
    res.render('index.ejs', {
        books: books,
    });
});

app.post('/post', async (req, res) => {
    const input = parseInt(req.body.bookId);
    if (input === 0) {
        // I'm sending 0 as id if we're creating a new one
        res.render('new.ejs', {
            book: {
                id: 0,
                title: '',
                openlib_id: '',
                author: '',
                rating: 0,
                review: '',
            },
        });
    } else {
        const result = await db.query('SELECT * FROM books WHERE id = $1', [
            input,
        ]);
        const book = result.rows[0];
        res.render('new.ejs', {
            book: book,
        });
    }
});

app.post('/new', async (req, res) => {
    const input = parseInt(req.body.bookId);
    if (input === 0) {
        // In this case we need to create a new one
        try {
            await db.query(
                'INSERT INTO books (title, author, openlib_id, rating, review, date) VALUES ($1, $2, $3, $4, $5, $6)',
                [
                    req.body.bookTitle,
                    req.body.bookAuthor,
                    req.body.bookOlid,
                    parseInt(req.body.bookRating),
                    req.body.bookReview,
                    new Date().toISOString().substring(0, 10),
                ]
            );
            res.redirect('/');
        } catch (err) {
            console.log('There was an error: ' + err.stack);
        }
    } else {
        try {
            await db.query(
                'UPDATE books SET title = $1, author = $2, openlib_id = $3, rating = $4, review = $5 WHERE id = $6',
                [
                    req.body.bookTitle,
                    req.body.bookAuthor,
                    req.body.bookOlid,
                    parseInt(req.body.bookRating),
                    req.body.bookReview,
                    input,
                ]
            );
            res.redirect('/');
        } catch (err) {
            console.log('There was an error: ' + err.stack);
        }
    }
});

app.post('/delete', async (req, res) => {
    const input = req.body.bookId;
    try {
        const result = await db.query(
            'DELETE FROM books WHERE id = $1 RETURNING *',
            [input]
        );
        console.log(result.rows[0]);
        res.redirect('/');
    } catch (err) {
        console.log('There was an error: ' + err.stack);
    }
});

app.listen(port, () => {
    console.log(`The server is listening on port ${port}`);
});

/* Okay the project has now ended, I will not add anything more
I did not find an API I could incorporate within the time limit, and it's already 11pm, I started at 6pm.
My time management has been a failure, but then again, building anything from scratch, no matter how small, is time consuming.
It's a wrap. I didn't get to use Axios so I may as well remove it from the modules */
