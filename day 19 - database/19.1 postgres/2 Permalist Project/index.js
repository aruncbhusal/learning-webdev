/* The project is a todo list where we can add, edit, delete todo items. Simple in concept but let's see how it goes.
The starting files already have the front end set up, all the static files.
My job is to first run it by installing the required npm packages, then create a new database, new table, and work with it.
The current index.js contains a simple set up, with bodyParser and express static set up, and a barebones '/' route and 'add' route
Other routes like 'edit' and 'delete' are just declared but are empty.
I will now start the project. */

// My first task is to import the pg module and set up the database, since I've created it from pgAdmin already
import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

const app = express();
const port = 3000;

const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'todolist',
    password: 'postygresy',
    port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

await db.connect();

let items = [];

async function updateItems() {
    const result = await db.query('SELECT * FROM items ORDER BY id ASC');
    result.rows.forEach((item) => items.push(item));
}

app.get('/', async (req, res) => {
    // Let's reset the items on each reload and make it update them. I don't want the global list to interfere
    items = [];
    await updateItems();
    res.render('index.ejs', {
        listTitle: 'Today',
        listItems: items,
    });
});

app.post('/add', async (req, res) => {
    // This function works for non persistent, but we need persistence
    const item = req.body.newItem.trim();
    if (item.length > 0) {
        try {
            const result = await db.query(
                'INSERT INTO items (title) VALUES ($1) RETURNING *',
                [item]
            );
            items.push(result.rows[0]);
        } catch (err) {
            // Since I've enforced a UNIQUE constraint, I need to do this
            console.log(
                'Either he todo item has already been added, or it is empty: ' +
                    err.stack
            );
            // Since NOT NULL was not a constraint, I thought I should add it as well
            // Looks like it doesn't really work for '' values so I'll need to add a check in the edit and add functions instead
        }
    }
    // I could add a 'required' field in the front end, but I haven't touched that yet, so I may as well not
    res.redirect('/');
});
// Guess this is done for now

app.post('/edit', async (req, res) => {
    // The edit button behavior already exists in the front end, we now need to respond to the form submitted on clicking 'done'
    // Since she has helpfully included the id inside the form as a hidden parameter, we can use it
    const itemId = parseInt(req.body.updatedItemId);
    const itemTitle = req.body.updatedItemTitle.trim();
    if (itemTitle.length > 0) {
        try {
            const result = await db.query(
                'UPDATE items SET title = $1 WHERE id = $2;',
                [itemTitle, itemId]
            );
            // We could also update the list here, but since we're already updating on homepage, I'll ditch it
        } catch (err) {
            console.log('An error has occured: ' + err.stack);
        }
    }
    res.redirect('/');
});

app.post('/delete', async (req, res) => {
    // We need to delete when item is checked off. This triggers a form submission in the frontend
    const itemId = req.body.deleteItemId;
    try {
        await db.query('DELETE FROM items WHERE id = $1;', [itemId]);
    } catch (err) {
        console.log('An error has occured: ' + err.stack);
    }
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
// It works, I guess this is it

/* Things I noticed about the solution code:
1. She too used the ORDER BY id ASC like I did, because only then will the newly updated items retain their position
2. She didn't check for whether the input title was empty, so we can just add/edit empty items
Possible upgrade routes: Order by creation date, Multiple lists for same user, Multiple lists according to user (family to-do list) */
