/* in this one, we've actually got a challenge, to ensure this code works as expected, the code is already given let's go through it
No trace of pg module or anything regarding it as expected. Structured very similarly to the last project,
but here we don't have a quiz array yet so we'll need to use what we've learnt to ensure the quiz array is loaded.
Since I've already created the flags table in 17.4.2, I can simply use it here

Okay I did it and started the server, but since windows doesn't support emoji flags, I don't know what I can do here.
I decided to use Twemoji plugin on the client side, and now will inject the script into the ejs file, as recommended by GPT.
What it does is every time the DOM content is loaded it looks for any emoji characters and replaces them with SVGs. Let's see if it works

After much effort and scrolling GitHub for fixes, I finally managed to make it work.
I had been getting errors after errors, only to realize there was error while checking answer
The course had put capital to be checked, but we needed to check name instead

Something I discovered later: The course actually did have a heads up for Windows not displaying flags
It recommended using Mozilla Firefox instead of Chrome, which I didn't do. My fault I guess */

import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

const app = express();
const port = 3000;

// Let's set up the database
const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'countries',
    password: 'postygresy',
    port: 5432,
});

db.connect();

let totalCorrect = 0;
// Let's now initialize an empty quiz array then populate it with a query
let quiz = [];

db.query('SELECT * FROM flags', (err, res) => {
    if (err) {
        console.log('There was an error: ' + err.stack);
    } else {
        quiz = res.rows;
        console.log('Successfully imported the rows');
    }
    db.end();
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let currentQuestion = {};

// GET home page
app.get('/', (req, res) => {
    totalCorrect = 0;
    nextQuestion();
    console.log(currentQuestion);
    res.render('index.ejs', { question: currentQuestion });
});

// POST a new post
app.post('/submit', (req, res) => {
    let answer = req.body.answer.trim();
    let isCorrect = false;
    if (currentQuestion.name.toLowerCase() === answer.toLowerCase()) {
        totalCorrect++;
        console.log(totalCorrect);
        isCorrect = true;
    }

    nextQuestion();
    res.render('index.ejs', {
        question: currentQuestion,
        wasCorrect: isCorrect,
        totalScore: totalCorrect,
    });
});

function nextQuestion() {
    const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
    currentQuestion = randomCountry;
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
