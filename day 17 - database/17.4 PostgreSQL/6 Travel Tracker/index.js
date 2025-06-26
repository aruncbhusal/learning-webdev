/* Now here's a challenge we need to do on our own (kind of). The project is split into multiple parts
The index.ejs is already ready for us, probably, and this one has server set up done, middlewares brought, but no db setup
Also no routes are set up yet. So this is what we're starting with.
Anyway, we need to first create the table and I'll have to follow the course for now because no specifics have been given yet

So we need to first create a table called visited_countries with a primary key id which is of serial data type,
but the next field is country code which is char(2) and it cannot be null and must be unique as well.
Next we insert some values into this manually so that we can test the code.
Finally the challenge is to make the get part work with those values pre existing in the database */

/* In the script of the index.ejs file the split method is used because EJS templating places the value as a string
So we need to first convert into an array in order to work with it as an iterable */

/* After part 1: Display hardcoded visited countries, is complete, we now need to add the functionality to add a country by name
So for that we need to first create a new table called countries and we'll use the countries.csv in this folder to import the data
The fields will be the CHAR(2) country code and the VARCHAR(100) country name */

// Now our job is to first set up the database link and get the countries
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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

db.connect();

app.get('/', async (req, res) => {
    const countries = await getCountries();
    //Write your code here.
    // Saw await being used in the course sample example, but apparently, can't use it with the callback function as it doesn't return a promise
    // So I'll just do as in the example I saw earlier from GPT

    res.render('index.ejs', {
        countries: countries,
        total: countries.length,
    });
    // We need to send two things: the list of countries, and a total number of countries
    // db.end();
    // I added the db.end seeing it from the course, but we still need it later when requesting via post. We have to keep it connected
    /* Differences: I added the db.end() after seeing the solution, didn't know we could close the connection outside of the callback
  Also I did the object to array differently, while I got the countries into an object first then reassigned, had I known it would be an object,
  I too would have used a forEach with result.rows like it was done in the course. But anyhow, this solution is valid. */
});

async function getCountries() {
    let countries = [];
    try {
        const result = await db.query(
            'SELECT country_code FROM visited_countries'
        );
        countries = result.rows;

        // We want to send an array so what if I do this:
        for (let i = 0; i < countries.length; i++) {
            countries[i] = countries[i].country_code;
        }
    } catch (error) {
        console.log('There was an error: ' + error.stack);
    }
    // From an array of objects to an array of strings
    console.log(countries);
    // Well it worked!
    return countries;
}

/* Next we need to add another route called /add where the user will post the name of a country, we need to find the country code
It is simple bcause we already have a table with countries and their codes, then we add the new entry to visited countries table
When making db queries using node, we need to use the $ notation i.e. any variables in the query will be $1 $2 ...,
then in the next parameter we need to give values for those variables in the form of an array */
app.post('/add', async (req, res) => {
    // I used to have countries as a global variable, but in a server, a global mutable variable is just a recipe for disaster
    // Any user could modify it for another user, not good. How about I make it a function and extract countries array from there
    const countries = await getCountries();

    const countryName = req.body.country.trim();

    // Now we need to check if this exists in the database, or it is a typo, in which case we can't allow any addition
    const result = await db.query(
        "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
        [countryName.toLowerCase()]
    );
    // Postgres is case sensitive so I ditched = for ILIKE (suggested by GPT btw) to ensure case insensitiveness
    // But since we also need to allow for countries whose initial matches and that's enough, we'll need LIKE instead
    // And for case insensitivity, we used SQL's LOWER and JS's toLowerCase together
    // console.log(result.rows);
    // Okay the response is an array with 0 or 1 elements, so let me try this:
    if (result.rows.length > 0) {
        // The final part was to make the code safe from edge cases, like what if a user enters the same country again?
        // Postgres would throw an error so we need to catch it here. To do it we can simply use:
        try {
            await db.query(
                'INSERT INTO visited_countries (country_code) VALUES ($1);',
                [result.rows[0].country_code]
            );
            res.redirect('/');
        } catch (error) {
            res.render('index.ejs', {
                countries: countries,
                total: countries.length,
                error: 'That country has already been added.',
            });
            // Since I'm not expecting any error other than a UNIQUE constraint violation here, I will simply use this
            // NULL violation will be handled by the if block already because no country exists with name ''
        }
        // In the end we'll just send them to the normal route for the countries to be updated
    } else {
        // If we don't find the country code, I don't even want to give an error, but idk maybe I should
        res.render('index.ejs', {
            countries: countries,
            total: countries.length,
            error: 'The country was not found in the database. Try again.',
        });
    }
});
// Okay this should be it. In the course solution, the app will crash and break if wrong name is passed, res.redirect is inside if
// But she has taken the "query to save into countries array" inside the get into an async function.

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
