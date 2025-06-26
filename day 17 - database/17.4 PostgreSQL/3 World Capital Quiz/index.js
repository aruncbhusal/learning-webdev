/* In this project, we will use database to complete the quiz app here. The backend and frontend has already been done for us
We just need to add the database functionality to the web app now. In fact, in this one, we're only reading the data onto quiz variable
Let's first go through the code that is already written for us and how it works
First thing is node module installs and imports, and after once done, we just needed to fill the places where the db creation was done
In the files shown in the course, the db wasn't set up, but in the file I have, it seems to already have been done.
I'll judt walk through it. We create a new Client object, the user is the default postgres (server name) and host is localhost
The database, I had named countries, and the password for the server, as well as the port, I had to fill/verify.
Next the db was connected, then the query method which takes a query string, and a callback with parameters for error and response
First we check for error, and log it if so, but if not, we populate the quiz array with the received rows.
In the initial code, the quiz array already has 3 objects, but I'll remove them to start with a clean slate.

Now in the program logic, we have a nextQuestion function which is async and selects a question at random and puts it in currentQuestion object
In the get request, first, totalcorrect is reset, and the first question is passed to the index.ejs file
In the index file, the score, country name are displayed, and after answer, correct or incorrect is shown for the last answer
Also there is a script tag inside the ejs which gives the client side an option to restart if incorrect by replacing the form
In the server, we take a post request where we take trimmed (leading and trailing spaces removed) answer and compare in lower case
There is no null handling, so I think I should add it in the ejs as validation for "required"

I wonder what even is the point anymore, it's already complete, maybe just to see how it works
Okay looks like we have another quiz (flag quiz) in 4, in which we need to do it ourselves apparently (apart from frontend/logic) */

import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

const app = express();
const port = 3000;

const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'countries',
    password: 'postygresy',
    port: 5432,
});

db.connect();

let quiz = [];

db.query('SELECT * FROM capitals', (err, res) => {
    if (err) {
        console.error('Error executing query', err.stack);
    } else {
        quiz = res.rows;
    }
    db.end();
});

let totalCorrect = 0;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let currentQuestion = {};

// GET home page
app.get('/', async (req, res) => {
    totalCorrect = 0;
    await nextQuestion();
    console.log(currentQuestion);
    res.render('index.ejs', { question: currentQuestion });
});

// POST a new post
app.post('/submit', (req, res) => {
    let answer = req.body.answer.trim();
    let isCorrect = false;
    if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
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

async function nextQuestion() {
    const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];

    currentQuestion = randomCountry;
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
