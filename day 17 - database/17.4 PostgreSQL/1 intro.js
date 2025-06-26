/* Postgres is one of the most popular database management systems, uased by Apple, Instagram, NASA, etc.
In order to use PostGres we need the node-postgres package, which is called "pg"
We also need softwares since we want to set up a server in our local machine. We need Postgres Server and pgAdmin
pgAdmin is so that we can query the database using the GUI rather than using the command line.
We can install it online easily as it is a free and open source application.

To use we have the following parts: (not actual code) */

import Client from 'pg';

const db = Client({
    hostname: 'host',
    username: 'user',
    password: 'password',
    database: 'database',
    port: 5432,
});

db.connect();

db.query('SELECT * FROM users', (err, res) => {
    if (err) {
        console.log('An error has occured.');
    } else {
        console.log('The data: ' + res.rows);
    }

    db.end();
});

// I wrote this from memory so it is probably incomplete, but this is the basic zest behind it. We set up a db client
// Then we use the client to make query on the database after connecting. The query has a callback which has parameters error and response.

/* In a SQL table, the columns are called fields, and rows are called records. We need database over simple spreadsheets because they can handle large number of records
In postgres, we can create a new table (example) in this way:
CREATE TABLE people (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    age INT,
    is_married BOOLEAN
)
We can see that there are mnay data types available, the serial data type automatically increments for each new entry
The varchar(variable character) data type here has max 50 character length, but can shrink if data is smaller, unlike char(50)
In recent days, text type is being used popularly rather than varchar, with not a big hit in performance
Other data types are normal, int and boolean, but we also have types like bit, large int and so on. */
