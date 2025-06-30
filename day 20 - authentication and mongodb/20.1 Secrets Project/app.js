/* Authentication is when we want to know who is accessing our service, to be able to limit access, and associate actions with users
First let's take a look at the starting files and see what we're working with.
The partials folder inside views has a header that brings a font, bootstrap css, and a custom styles.css with basic styling. Footer is barebones
Using these headers and footers, we also have other files: home, login, register, secrets and submit, all ejs files
Home has two links, one for /register one for /login. The page is a simple bootstrap jumbotron
Login page has a card with a form that posts to /login with username (email) and password, also has a commented OAuth div, to be used later probably
Register is similar, only making a post request to /register route instead, also with social media login (OAuth)
The secrets file has two buttons for logout and submit, all inside a single jumbotron div
Finally the submit file has a form that posts to /submit with the secret text
This file itself has nothing, though basic setup was seen in the course. I'll get it set up now before we continue
First I'll install all required modules, express, ejs and body-parser */

/* Apparently this module is from an earlier version of the course which uses Atom as IDE, but more importantly, MongoDB instead of Postgres
So I think I can also learn mongo a bit from this lesson, so I've decided to install it. I will document the learning in this file so I should be ok
Also, I noticed that this old course also uses the old "require" syntax instead of the modules, probably because ES8 was not introduced yet */

/* I already had MongoDB 6.0 but forgot, and downloaded 8.0 then deleted 6.0, all because mongod command was not working
Anyway now that it is out of the way, we can use the npm package 'mongoose' to use mongoDB in our application */

import dotenv from 'dotenv';
dotenv.config();
// dotenv suggests that we import it and config as soon as possible in the document
import express from 'express';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
// import encrypt from 'mongoose-encryption';
// Since we don't use encryption after level 3, we don't need this package anymore
// import md5 from 'md5';
// Since we don't use md5 hashing after level 4, we don't need this package either
// import bcrypt from 'bcrypt';
// Since we don't use bcrypt after level 5, we don't need this package either
import session from 'express-session';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
// After all these imports, we can finally use passport
import { Strategy } from 'passport-google-oauth20';
// This was in CJS form as well, so had to use this
import findOrCreate from 'mongoose-findorcreate';

const app = express();
const port = 3000;
const saltRounds = 10;
// Adding a salt round exponentially increases the time needed to calculate it, so we'll use 10 here

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
// Now we need to create the session cookie using the express-session middleware
app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
    })
);
/* Here we must set a secret, but the others are to avoid saving everything to the 'session store' and only save when modified
Then we can finally initialize the passport with this session */
app.use(passport.initialize());
app.use(passport.session());

/* We need to connect the database with our web app, and run it on a separate port (separate terminal) */
// mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true });
// useNewUrlParser is being deprecated soon so I will not use it, maybe it is the default, so I'm getting no errors

mongoose.connect('mongodb://localhost:27017/userDB');
// In order to avoid a warning in the console when working with passport, she had added:
// mongoose.set('useCreateIndex', true);
// But I don't think it's needed anymore because I'm not getting any warnings

/* For the connection we need to specify the default port 27017 and name of new database i.e. userDB
The useNewUrlParser flag avoids an error on the console because of mongoose trying to use the old parser
Now we can run "mongod" on another terminal to start the mongodb server which then we can use here, need to use cmd for this instead of bash
using cmd because bash doesn't have the environment variable we've set for windows. Also we need data/db in the root directory (C: or D:)
Since I have it in C:, I needed to type "C:" to change from D drive to C drive for it to work
*/

// After connecting, our next job is to create a schema and create models, we can use
/*
const userSchema = {
    email: String,
    password: String,
};
*/
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String,
});
// Since we don't store OAuth the same way with email and password, we need to instead store the googleID
// Else we can't associate a user with their google account
// The final part is to associate a secret with each account, and allow submission of secrets

/* To use passport with a mongoose schema, we use the passport-local-module and its given plugin */
userSchema.plugin(passportLocalMongoose);
// Also need to include the plugin for findOrCreate since it is not available by default with Mongoose schema
userSchema.plugin(findOrCreate);

/* Level 2: Encryption
We can instead use encryption, where we use a secret key to create a different string/data from the plaintext, and store that
Then in order to decrypt, we can use the same secret key.
When using MongoDB, there is a node package called mongoose-encryption which can do the encryption part for us
It uses the AES-256-CBC method which is a fairly advanced encryption method. For it first we need to import that package
Then we need to create a schema from the base mongoose schema object, instead of JS object, because we need to add a plugin to it */

// userSchema.plugin(encrypt, {
//     secret: process.env.SECRET_KEY,
//     encryptedFields: ['password'],
// });
// We won't be encrypting since we already use hashing for the passwords, in level 3

// Since we only need to encrypt password, we also need to send an option with this while adding the plugin
// We don't even need to change the rest of the code from Level 1 because the plugin handles encryption/decryption on save and find actions

// We can use the basic JSON format, then create a model
const User = new mongoose.model('User', userSchema);
/* In order to use passport with this model, we need to link passport with the user we want to authenticate
We need to create a strategy first, then we can serialize (form a cookie and save), and deserialize (read from the cookie and find out) */
passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// It was fine when using the local strategy to serialize with default methods, but since we're using OAuth, we need to use another
// This one works for both OAuth and local strategies, and is from https://www.passportjs.org/concepts/authentication/sessions/
passport.serializeUser((user, done) => {
    done(null, user.id); // Just store the ID (for the user object)
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id); // This id is NOT the googleId
        if (!user) return done(null, false); // or return an error
        return done(null, user); // full user object now available, this object has the googleId
    } catch (err) {
        return done(err);
    }
});
// This is different from the one in the course, well not anymore since I asked GPT and it gave me one that looks pretty similar

// Along with local strategy, we also need the Google Strategy (the Strategy method we've imported)
passport.use(
    new Strategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google/secrets',
            // Apparently there was a warning because of Google+ deprecation so this was needed at that point:
            // userProfileURL: 'https://googleapis.com/oauth2/v3/userinfo',
        },
        function (accessToken, refreshToken, profile, cb) {
            User.findOrCreate({ googleId: profile.id }, function (err, user) {
                return cb(err, user);
            });
        }
    )
);
/* I copy pasted from the docs, but since it used require with GoogleStrategy variable containing the module's Strategy,
I needed to change it to just "Strategy"
Since we don't have a function called findOrCreate, we need to make it ourself, but since people have already made it,
we can simply import the mongoose-findorcreate module and add the function ourself */

app.get('/', (req, res) => {
    res.render('home');
});

/* Since we've implemented Google Auth, we also need to include them in the login and register pages
So I uncommented the links there, and now we need more routes, ones that lead to /auth/google, and one for /auth/google/secrets
I'll just copy the code from the docs and modify as needed */

app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile'] })
);

app.get(
    '/auth/google/secrets',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect to secrets.
        res.redirect('/secrets');
    }
);

/* Now that this is done and dusted, let's make the login/signup buttons look better by downloading https://lipis.github.io/bootstrap-social/
I can then use it to add new classes to btn-social and btn-google to the signup and login buttons */

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

/* Level 1 Authentication: Username and password
We need to set up the register and login routes where we take the data posted from the form, and let them access secrets */

/* Level 3 Authentication: Hashing the password
Instead of relying on encryption, which is compromised when the encryption key is known, we can use a hash function, which doesn't have a key
In hashing, we pass a plaintext into the hashing function and it generates a hash. It is almost impossible to generate the plaintext from the hash
It is almost impossible because we can generate hash almost instantly, but decoding the hash takes way too much time.
In order to implement this, we simply need to import the md5 package which lets us use md5 hashing for our passwords while saving
Since the same plaintext always gives the same hash, we can then compare the hash of the submitted password to authenticate the user */

/* Since I'll be using salting instead, I don't want to keep changing this code, it wouldn't contain the things I've done so far
I will just leave this chunk commented out, and implement the salting method below instead

app.post('/register', async (req, res) => {
    // First we need to create the new user with given email and password
    // The basic validation for an email (a @ and a .) is checked by the HTML itself, so we can simply create new user
    const newUser = new User({
        email: req.body.username,
        // password: req.body.password,
        password: md5(req.body.password),
    });
    // After creation, we now need to save it into the database
    // newUser.save((err) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         res.render('secrets');
    //         // We don't want to render the secrets via its own route for now because we want to authenticate first
    //     }
    // });
    // Apparently, save method doesn't accept a callback anymore. This is a disadvantage of following a course made years ago

    // Anyway I looked through the docs and now save returns a promise, so we need to make this an async function to use it
    try {
        await newUser.save();
        res.render('secrets');
    } catch (err) {
        console.log(err);
    }
});

app.post('/login', async (req, res) => {
    // In order to log in a user, we first take their input, find the user, then compare the password with the one in the db
    const username = req.body.username;
    // const password = req.body.password;
    const password = md5(req.body.password);

    // User.findOne({ email: username }, (err, foundUser) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         if (foundUser && foundUser.password === password) {
    //             // This was two nested if statements but I consolidated into one
    //             res.render('secrets');
    //         }
    //     }
    // });
    // We use the findOne method to find user by email, then if the user exists and password matches, we send them to secrets

    // Similar to save(), findOne returns a promise as well. So we need to refactor this one as well
    try {
        const foundUser = await User.findOne({ email: username });
        if (foundUser && foundUser.password === password) {
            res.render('secrets');
        }
    } catch (err) {
        console.log(err);
    }
});

*/

/* After level 1: At this point when we look at the database we can see that the password is stored as plaintext
But this is not secure, anyone who gets access to the database will know what the password is. This is not secure.

After level 2: Now the passwords can be seen as a long binary string, but the user only has to send their plaintext password
In fact, we can log out the password from the database after getting from the user and it will log it out in plain text.
Since this is possible, it still isn't a very secure authentication method and we need to level the security up.

But there's a slight problem here. Encryption is a valid method for authentication, but we might want to push the code to GitHub
But in our code, we have the secret key, so anyone who looks at our code knows how to decrypt it.
So we should instead set "envionment variables" stored in a .env file on our working directory
This file is not uploaded to github, and included in .gitignore
In the .env file we store it as KEY=VALUE with one pair per line, no spaces between, and by convention key in capital and snake case
The lines are not separated by comma/semicolon, and the value should not be inside quotes
In order to use the values inside .env, we need to import dotenv package and run config() method
Finally we can use process.env.KEY to access the environment variable

We can see some useful sample gitignore files in https://github.com/github/gitignore
From this repo, we can use the node gitignore file in our project so that all files and folders like .env, node-modules, etc are not pushed to GitHub
Since we can easily use 'npm i' to install the dependencies in package.json, we don't need to include the node-modules in our repo
So from this project onwards, the node-modules folder won't be available along with the other files.

After level 3: The password in the database is now a hash instead of a normal plaintext password or an encypted binary that can be decoded
We don't know what the password is and there's no way to know, almost. And we only compare that hash with user sent hash to authenticate.
But since hashes for identical passwords are identical by design, hackers can create hash tables with common passwords, and compare with that table
Since md5 hash can be calculated very quickly, GPUs can create billions of hashes per second. This risks our password in bruteforce attacks.
So to protect our passwords, we need uncommon passwords, numbers, special characters, and more importantly, long passwords. */

/* Level 4: Hashing + salting
Since we want to prevent dictionary attacks and hash table attacks, we can use a salting process.
In this process, we add a random string to the current password and hash it, and we can re hash the current hash by salting it again.
We can do it for a predefined number of 'rounds', and the password is safer this way.
To generate hashes, we instead use bcrypt which is the industry standard, as is it safer since it takes longer to generate the hash
So hackers can't create hash tables quickly and can't crack our passwords easily.
To use bcrypt, we simply need to use bcrypt module, then use it to generate the hash, and later compare the hash for login */

/* As we reach level 5, which is using passport module to work with cookies and persistent authentication,
we won't need to use the code for level 4 either. We will have updated code below

app.post('/register', async (req, res) => {
    // bcrypt supports both callback method (sync) and a promise method for async. Since we already use async,
    // I will be using the async version to generate the hash, but if we had callback, all this user creation code would be enclosed inside the callback
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = new User({
        email: req.body.username,
        password: hash,
    });
    try {
        await newUser.save();
        res.render('secrets');
    } catch (err) {
        console.log(err);
    }
});

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const foundUser = await User.findOne({ email: username });
        if (foundUser) {
            // We only compare passwords if the user exists
            const result = await bcrypt.compare(password, foundUser.password);
            if (result) {
                // If the result of compare is true, then we render the secrets page
                res.render('secrets');
            }
        }
    } catch (err) {
        console.log(err);
    }
});

*/

/* After level 4: The password stored in the db is now a longer bcrypt hash and even if a different user uses the same password,
the hash will be different because of the salt. Now we can use this to authenticate the users more securely. */

/* Cookies and Sessions
When we visit a website, and we request something from them, maybe make a post request, the website server saves a cookie in our browser
So even if we close the tab and reopen later, the cookie is sent along with our new request, so that the server knows who we are, and if we had a session
The cookies themselves don't store anything other than our information as well as cookie ID. This ID is also stored in the server database,
so this ID can be used to retrieve the information associated with the "session" i.e. the time between a log-in and a log-out
We can use the node module called passport to authenticate the users based on this session cookie. It is very popular. */

/* Level 5: Cookies and Session based authentication
Right now, we need to login/register each time we want to visit the secrets page, which is not very convenient.
We might instead want to keep the user authenticated even when the user closes and reopens the tab.
In order to implement this, we need to use a module called passport. To use this module, we need to install the following packages:
passport, passport-local, passport-local-mongoose, express-session. */

// app.get('/secrets', (req, res) => {
//     // Since we redirect to this page if authenticated, we need to add a check here
//     if (req.isAuthenticated()) {
//         res.render('secrets');
//     } else {
//         res.redirect('/login');
//     }
// });
// We need to display all secrets rather than a hard coded one, and we want the page to be viewable by anyone

app.get('/secrets', async (req, res) => {
    // First we need to get all the users with secrets from the db, users whose secret is not equal to null
    // User.find({ secret: { $ne: null } }, (err, foundUsers) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         res.render('secrets', {
    //             users: foundUsers,
    //         });
    //         // Since the secrets.ejs file doesn't have take any users argument, we now need to add templating to show all
    //     }
    // });
    // Transition to async/await syntax
    try {
        const foundUsers = await User.find({ secret: { $ne: null } });
        res.render('secrets', {
            users: foundUsers,
        });
        // Since the secrets.ejs file doesn't have take any users argument, we now need to add templating to show all
    } catch (err) {
        console.log(err);
    }
});

/* After all the authentication part is done, now we need to work on functionality, we want people to be able to submit their secrets
So we need a new submit route where people are shown the submit page, as well as can make a post request with their secrets */
app.get('/submit', (req, res) => {
    /* In order to be able to submit, we need to have a user be logged in, so we use the code for previous /secrets here */
    if (req.isAuthenticated()) {
        res.render('submit');
    } else {
        res.redirect('/login');
    }
});

app.post('/submit', async (req, res) => {
    const submittedSecret = req.body.secret;
    // Now we need to know who submitted this secret, but we can do that using passport's feature which adds a .user to req
    // User.findById(req.user.id, (err, foundUser) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         if (foundUser) {
    //             foundUser.secret = submittedSecret;
    //             foundUser.save(() => {
    //                 res.redirect('/secrets');
    //             });
    //         }
    //     }
    // });
    // Apparently find and findById no longer accept a callback anymore, so we need to transition to modern syntax
    try {
        const foundUser = await User.findById(req.user.id);
        if (foundUser) {
            foundUser.secret = submittedSecret;
            // The save method doesn't accept a callback either
            try {
                await foundUser.save();
                res.redirect('/secrets');
            } catch (err) {
                console.log(err);
            }
        }
    } catch (err) {
        console.log(err);
    }
});

/* Level 6: OAuth with Google (Next Day)
I think I'll need to get this done here and now, instead of creating an identical file for the next day as well.
We can use this method for signup/login to get the load of storing user passwords and securing them off our website, to social media.
We can let Google users authenticate themselves with our app, and we give access based on their Google ID.
When logging in, we send them to the google's signin page where we can request for different data on them, and they can choose to authorize
We can then ask for an access token from Google which contains the id for the user to be associated to a record on our databse.
For all this, we will need to use passport's Google OAuth 2.0 strategy.
Following the steps in: https://www.passportjs.org/packages/passport-google-oauth20/
but first we need to go to Google Dev Console and get the OAuth ID and secret
After all the setup, getting Client ID, secrets, and setting up scopes for email, Google ID and profile, now we're ready for passport */

app.post('/register', (req, res) => {
    // As always, the course is using the callback method, but we'll be using async method which is supported as per docs
    // Due to a lack of proper documentation, I think I'll fall back to the traditional method in the course instead
    User.register(
        { username: req.body.username },
        req.body.password,
        (err, user) => {
            if (err) {
                console.log(err);
                res.redirect('/register');
            } else {
                passport.authenticate('local')(req, res, () => {
                    res.redirect('/secrets');
                });
            }
        }
    );
});

app.post('/login', (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });
    // We need to create a new user before passing it onto the authentication function i.e. login
    req.login(user, (err) => {
        if (err) {
            console.log(err);
            res.redirect('/login');
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/secrets');
            });
        }
    });
});

// Finally we also need a logout route
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`The server is now running on port ${port}`);
});

/* It's almost midnight already so I think I should pause this here for now. I will need to create a new folder for this tomorrow
A waste of storage but then again there was way too much to learn today, and I only began at around 4:30 pm.
Will have to cover OAuth tomorrow. */

/* Since we need all the packages, I've decided that I will finish the full code here, even though it's a different day */

/* Finally at around 10 am, the deed is done. A single app, spanning more than a day */
