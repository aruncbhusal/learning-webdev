/* Relationships are an important part of SQL. The first type of relationship is a one to one relationship.
Databases are optimized for a large number of rows, but large number of fields can make it slower, so we should split tables when possible
While splitting tables, we might need information inside both tables, so we can use one to one relationship to create a link.
For it, we have a root table with a primary key, which is then referenced in the other table as a foreign key.
Then we can select all the fields by making a JOIN, or an INNER JOIN between the two tables on the basis of that foreign key.
The SQL commands are given in queries.sql. I didn't write the code here, the starting code is the same as end of last project.

We first need to create a new database in pgAdmin, and use the queries to create the two new tables, then join them and observe.
In order to join them we can simply use: SELECT * FROM <table1> JOIN <table2> ON <table1.id> = <table2.id>

Another type of relationship is the one-to-many or many-to-one relationship, used when one entry in a table can be associated to multiple entries in another
In our example, the student table can be linked with multiple homework tables so we need a one-to-many (basing on student table)
The sql code is all from the queries.sql, I didn't write them, it's all from the course.
Here the homework table has its own primary key to uniquely identify each homework, but also a foreign key to reference student id.
Then we can use a join like last time to get all the data, but since the id is redundant in this case, we can drop them,
and simply use student.id then the names of other needed rows like first_name, last_name and marks
It is represented with a crow's feet arrow towards the "many" side.
We may have multiple tables in our database, and they may be named in plural or singular form. Any is fine, but we should be consistent.

The final type of relationship is a many to many relationship. This is not a direct relationship between two tables but rather two many-to-one relationships
In this type of relationship, each item of table A can have multiple associations in table B and vice versa, like student and class
We can model this kind of relationship with both the tables having a many-to-one relationship with another table.
This table has two foreign keys, the primary keys of each table, and its primary key is both of these fields combined, so that redundancy is eliminated
So when we need to display the entire information, we join twice, once with each table on the respective PK/FK pair.
Since there can be redundant fields in the tables, we can use AS to set aliases for the fields, and we can even use it on tables to make it easier
We don't even need to use AS for aliases, we can simply write 'FROM student s' instead and then use s.id to access its id field */

/* Finally now the actual challenge: we'll be working with a base file from the last personal travel tracker and turning it into
a family tracker where each family member can create their "profile" and include their visited countries
There's SQL queries to create the tables and what not, but I'll just do it myself and document the process along the way
The functionalitites we need are:
- allow creation of multiple users, with their preferred color choices
- allow adding their visited countries without affecting someone else's list
- Display their visited countries in their own color
That's it probably. And the index.ejs is already given, we don't need to update it, but I probably will need to reference it
in order to make my backend compliant with the structure used there. Let's first run the code as is and see what we can do from here */

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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let currentUserId = 1;

let users = [];
// This list had some hardcoded values, but we need to allow people to add their own, so we'll need to create a table
// Then use the table to bring their own users from there. I will need to use pgAdmin to create the tables
// And also erase the current visited countries table to add an option for user id to be stored as well
// I could use ALTER TABLE, but let's keep it the way it is supposed to be for now. I'll use the deletion and re-creation method

/* Step 1: Table Creation
Created a user table first with
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name VARCHAR(50),
	color VARCHAR(30)
);
Then created a visited_countries table with
CREATE TABLE visited_countries(
	user_id INT REFERENCES users(id),
	country_id INT REFERENCES countries(id),
	PRIMARY KEY (user_id, country_id)
);
We'll need a many-to-many relationship with the countries table, and this does just that, while not allowing duplicates
GPT suggested making it a FOREIGN KEY explicitly in a lter line, to add stuff like ON DELETE CASCADE
but since we're not adding the functionality to delete users, I'll leave it be for now
Next step is to add a user to begin, then we can finally pull from the tables into the users array here
INSERT INTO users (name)
VALUES ('ACB');
 */

function updateUsers() {
    users = [];
    db.query('SELECT * FROM users', (err, res) => {
        if (err) {
            console.log('There was an error: ' + err.stack);
        }
        res.rows.forEach((user) => users.push(user));
    });
}

async function checkVisited() {
    // const result = await db.query('SELECT country_code FROM visited_countries');
    // This query is now obsolete so we need to send a user id from the function to check it for that particular user
    const result = await db.query(
        'SELECT country_code FROM visited_countries vc JOIN countries c ON vc.country_id = c.id WHERE vc.user_id = $1',
        [currentUserId]
    );
    // I initially had another join with users table, but with some consultation from GPT, it felt redundant so I limited it to single join
    let countries = [];
    result.rows.forEach((country) => {
        countries.push(country.country_code);
    });
    return countries;
}

async function getCurrentUser() {
    const result = await db.query('SELECT * FROM users WHERE users.id = $1', [
        currentUserId,
    ]);
    return result.rows[0];
}
app.get('/', async (req, res) => {
    updateUsers();
    const countries = await checkVisited();
    // When the page first loads, we'll load the default first user
    const user = await getCurrentUser();
    // The countries were not being shown, and I realized I had forgotten to add the await keyword here
    res.render('index.ejs', {
        countries: countries,
        total: countries.length,
        users: users,
        color: user.color,
    });
});
app.post('/add', async (req, res) => {
    // We also need to keep track of which user's tab we're in so we can cater for that user
    // I didn't notice the currentUserId global variable, maybe I should make use of that instead
    const input = req.body['country'];

    try {
        const result = await db.query(
            "SELECT id, country_code FROM countries WHERE LOWER(country_name) LIKE $1 || '%';",
            [input.toLowerCase()]
        );
        // Known bug: When I type India, it selects "British Indian Territories" instead because it is higher inside the list
        // I have tried to adderss that by removing the '%' symbol that was in front of the country name
        // Intuitively, we would be more likely to remember the starting word rather than something in the end or in the middle
        // idc if that breaks some other part, this is more annoying

        const data = result.rows[0];
        // const countryCode = data.country_code;
        const countryId = data.id;
        try {
            await db.query(
                'INSERT INTO visited_countries (user_id, country_id) VALUES ($1, $2)',
                [currentUserId, countryId]
            );
            // Since this one took country code, we needed to change it to country id instead
            res.redirect('/');
            // I was redirecting to /user but now I realize that route is just to change the current user Id. I'm just stupid
        } catch (err) {
            console.log(err);
        }
    } catch (err) {
        console.log(err);
    }
});
app.post('/user', async (req, res) => {
    if (req.body.user) {
        currentUserId = parseInt(req.body.user);
        // const result = await db.query('SELECT * FROM users WHERE id = $1', [
        //     userId,
        // ]);
        // const user = result.rows[0];
        res.redirect('/');
    } else if (req.body.add) {
        res.render('new.ejs');
    }
});

app.post('/new', async (req, res) => {
    //Hint: The RETURNING keyword can return the data that was inserted.
    //https://www.postgresql.org/docs/current/dml-returning.html
    const name = req.body.name;
    const color = req.body.color;
    const result = await db.query(
        'INSERT INTO users (name, color) VALUES ($1, $2) RETURNING id;',
        [name, color]
    );
    currentUserId = result.rows[0].id;
    // I was getting errors because I was directly assigning the result of the query to currentUserId, now it's fixed
    // Also I had forgotten that I needed to update the users after adding a new one so let me do that

    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

/* Differences with course solution
1. Biggest difference is that her relationship set up is one-to-many from users to visited countries, where she has user id and country codes
Mine has links to both countries table and the users table. I was thinking of this approach in the beginning but I wanted to test that approach out
And it was fun but at the same time frustrating to implement because I had to update the table with user id instead of codes, not too frustrating though
2. Rest of it is pretty similar, just some logic changes here and there, but in essence, it's the same

I think I will end today's learning for now, not much done today but then again it was an eventful day and I've only been here for 3 hours or so
I'll continue with this module again tomorrow. This one will have taken me 3 days, wow.*/
