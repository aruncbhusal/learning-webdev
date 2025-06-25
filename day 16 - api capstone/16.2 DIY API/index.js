/* We can find APIs on RapidAPI, but most of these APIs are paid, and we need to pay depending on the number of requests made
What makes these APIs monetizable: either they offer the data they collected, or offer an algorithm/servirce, or simplify an interface
The type of API we're trying to build is a RESTful API. REST stands for Representational State Transfer. For a REST API:
1. It follows the HTTP methods to make a request
2. It sends the response(representation) in a standarad format i.e. JSON or XML
3. It separates the client and server so that they can be scaled independently of each other
4. It must be stateless i.e. each request contains all the information needed for the server to respond to it
5. It must be resource-based, which means there must be a URI/URL(Uniform Resource Identifier/Locator) for the resource

In this one we'lll be building a Joke API with guidance */

import express, { request } from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
const masterKey = '4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT';

app.use(bodyParser.urlencoded({ extended: true }));

//1. GET a random joke
// I'll just try to do it myself first
app.get('/random', (req, res) => {
    // We need to get a random joke from the jokes variable and then send it as a json. Simple enough
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    res.send(JSON.stringify(randomJoke));
    // Okay apparently we can just use res.json to send an object and it does the rest for us. Nice
});

//2. GET a specific joke
// Here we need to hit the /jokes/:id endpoint. So this is my attempt:
// Oh wait I have no idea how to do this, I got ahead of myself, I don't know how to get the dynamic part of a link
app.get('/jokes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    // I just needed to add this line above to make it work, along with converting the params string to a number
    const joke = jokes.find((joke) => joke.id === id);
    // In order to find the joke inside the object array, I need to find the joke whose id is the same as the id we got from params
    res.json(joke);
});

//3. GET a jokes by filtering on the joke type
// Okay now this one I should be able to do myself
app.get('/filter', (req, res) => {
    const type = req.query.type;
    const foundJokes = [];
    jokes.forEach((joke) => {
        if (joke.jokeType === type) {
            foundJokes.push(joke);
        }
    });
    // Apparently we can just use a jokes.filter method to do exactly the same thing with an identicall callback to the find method
    res.json(foundJokes);
});

//4. POST a new joke
// This one adds a new joke to the jokes array using /joke endpoint
app.post('/joke', (req, res) => {
    // Since the body is a form type, we can simply use bodyparser to do the dirty work for us
    const jokeText = req.body.text;
    const jokeType = req.body.type;
    jokes.push({
        id: jokes.length + 1,
        jokeText: jokeText,
        jokeType: jokeType,
    });
    res.json({
        status: 'Success.',
    });
    // In the course solution, she created a new joke object putting all values directly
    // Then she pushed it to the jokes array, logged the last joke of the jokes array using slice
    console.log(jokes.slice(-1));
    // Then she rent the new joke object as a response to the client
});

//5. PUT a joke
// This one too goes to the jokes/:id endpoint but with some form data as input
app.put('/jokes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    jokes.forEach((joke) => {
        if (joke.id === id) {
            joke.jokeText = req.body.text;
            joke.jokeType = req.body.type;
            console.log(joke);
        }
    });
    res.json(jokes.find((joke) => joke.id === id));
    // I was going to do it the way it was done in the course, but I dind't know about the findIndex method
    // This method is basically find method but it returns the index instead. I could create a new joke object
    // Then use the index to insert that joke there, and also return the new joke to the user. But this works too
});

//6. PATCH a joke
// I wonder if my approach is going to work here, but let's keep our fingers crossed
app.patch('/jokes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const jokeIndex = jokes.findIndex((joke) => joke.id === id);
    if (req.body.text) {
        jokes[jokeIndex].jokeText = req.body.text;
    }
    if (req.body.type) {
        jokes[jokeIndex].jokeType = req.body.type;
    }
    // In the course solution, these if statements were replaced by creating a new joke object from the past one by using:
    // jokeText : req.body.text || existingJoke.jokeText
    // This line uses the latter part only if the first part is null
    res.json(jokes[jokeIndex]);
});

//7. DELETE Specific joke
// This one I'll use with the knowledge I have about splice
app.delete('/jokes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const jokeIndex = jokes.findIndex((jokes) => jokes.id === id);
    // She had a check for if the indedx was or was not found, so let's add that as well
    if (jokeIndex > -1) {
        // When the joke is found, we can remove the joke
        console.log(jokes[jokeIndex]);
        jokes.splice(jokeIndex, 1);
        res.send('OK');
        // In source solution, res.sendStatus(200) is used instead
    } else {
        // This block I hadn't written before, but after seeing the solution, I thought I should have it
        res.status(404).json({ error: `No joke found with id ${id}` });
    }
});

//8. DELETE All jokes
// Since we're giving the key as a query param, this should be pretty easy
app.delete('/all', (req, res) => {
    if (req.query.key && req.query.key === masterKey) {
        jokes = [];
        res.sendStatus(200);
    } else {
        res.status(403).json({
            error: "The action you're trying to perform is not per mitted.",
        });
    }
    // In the solution she did what I initially thought to do, but I think mine is better, not sure
    // She had a variable first taking the query parameter, but what if there was no key parameter given?
});

app.listen(port, () => {
    console.log(`Successfully started server on port ${port}.`);
});

var jokes = [
    {
        id: 1,
        jokeText:
            "Why don't scientists trust atoms? Because they make up everything.",
        jokeType: 'Science',
    },
    {
        id: 2,
        jokeText:
            'Why did the scarecrow win an award? Because he was outstanding in his field.',
        jokeType: 'Puns',
    },
    {
        id: 3,
        jokeText:
            'I told my wife she was drawing her eyebrows too high. She looked surprised.',
        jokeType: 'Puns',
    },
    {
        id: 4,
        jokeText:
            'What did one ocean say to the other ocean? Nothing, they just waved.',
        jokeType: 'Wordplay',
    },
    {
        id: 5,
        jokeText:
            'Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.',
        jokeType: 'Wordplay',
    },
    {
        id: 6,
        jokeText: 'How do you organize a space party? You planet!',
        jokeType: 'Science',
    },
    {
        id: 7,
        jokeText:
            "Why don't some couples go to the gym? Because some relationships don't work out.",
        jokeType: 'Puns',
    },
    {
        id: 8,
        jokeText:
            "Parallel lines have so much in common. It's a shame they'll never meet.",
        jokeType: 'Math',
    },
    {
        id: 9,
        jokeText: 'What do you call fake spaghetti? An impasta!',
        jokeType: 'Food',
    },
    {
        id: 10,
        jokeText:
            'Why did the tomato turn red? Because it saw the salad dressing!',
        jokeType: 'Food',
    },
    {
        id: 11,
        jokeText:
            'What do you get when you cross a snowman and a vampire? Frostbite!',
        jokeType: 'Wordplay',
    },
    {
        id: 12,
        jokeText:
            'Why did the golfer bring two pairs of pants? In case he got a hole in one!',
        jokeType: 'Sports',
    },
    {
        id: 13,
        jokeText:
            'Why are ghosts bad at lying? Because you can see right through them!',
        jokeType: 'Wordplay',
    },
    {
        id: 14,
        jokeText:
            "Why can't you give Elsa a balloon? Because she will let it go.",
        jokeType: 'Movies',
    },
    {
        id: 15,
        jokeText:
            "I'm reading a book about anti-gravity. It's impossible to put down!",
        jokeType: 'Science',
    },
    {
        id: 16,
        jokeText:
            'I told my wife she was drawing her eyebrows too high. She looked surprised.',
        jokeType: 'Puns',
    },
    {
        id: 17,
        jokeText:
            'What did one ocean say to the other ocean? Nothing, they just waved.',
        jokeType: 'Wordplay',
    },
    {
        id: 18,
        jokeText:
            'Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.',
        jokeType: 'Wordplay',
    },
    {
        id: 19,
        jokeText: 'How do you organize a space party? You planet!',
        jokeType: 'Science',
    },
    {
        id: 20,
        jokeText:
            "Why don't some couples go to the gym? Because some relationships don't work out.",
        jokeType: 'Puns',
    },
    {
        id: 21,
        jokeText:
            "Parallel lines have so much in common. It's a shame they'll never meet.",
        jokeType: 'Math',
    },
    {
        id: 22,
        jokeText: 'What do you call fake spaghetti? An impasta!',
        jokeType: 'Food',
    },
    {
        id: 23,
        jokeText:
            'Why did the tomato turn red? Because it saw the salad dressing!',
        jokeType: 'Food',
    },
    {
        id: 24,
        jokeText:
            'What do you get when you cross a snowman and a vampire? Frostbite!',
        jokeType: 'Wordplay',
    },
    {
        id: 25,
        jokeText:
            'Why did the golfer bring two pairs of pants? In case he got a hole in one!',
        jokeType: 'Sports',
    },
    {
        id: 26,
        jokeText:
            'Why are ghosts bad at lying? Because you can see right through them!',
        jokeType: 'Wordplay',
    },
    {
        id: 27,
        jokeText:
            "Why can't you give Elsa a balloon? Because she will let it go.",
        jokeType: 'Movies',
    },
    {
        id: 28,
        jokeText:
            "I'm reading a book about anti-gravity. It's impossible to put down!",
        jokeType: 'Science',
    },
    {
        id: 29,
        jokeText:
            'I told my wife she was drawing her eyebrows too high. She looked surprised.',
        jokeType: 'Puns',
    },
    {
        id: 30,
        jokeText:
            'What did one ocean say to the other ocean? Nothing, they just waved.',
        jokeType: 'Wordplay',
    },
    {
        id: 31,
        jokeText:
            'Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.',
        jokeType: 'Wordplay',
    },
    {
        id: 32,
        jokeText: 'How do you organize a space party? You planet!',
        jokeType: 'Science',
    },
    {
        id: 33,
        jokeText:
            "Why don't some couples go to the gym? Because some relationships don't work out.",
        jokeType: 'Puns',
    },
    {
        id: 34,
        jokeText:
            "Parallel lines have so much in common. It's a shame they'll never meet.",
        jokeType: 'Math',
    },
    {
        id: 35,
        jokeText: 'What do you call fake spaghetti? An impasta!',
        jokeType: 'Food',
    },
    {
        id: 36,
        jokeText:
            'Why did the tomato turn red? Because it saw the salad dressing!',
        jokeType: 'Food',
    },
    {
        id: 37,
        jokeText:
            'What do you get when you cross a snowman and a vampire? Frostbite!',
        jokeType: 'Wordplay',
    },
    {
        id: 38,
        jokeText:
            'Why did the golfer bring two pairs of pants? In case he got a hole in one!',
        jokeType: 'Sports',
    },
    {
        id: 39,
        jokeText:
            'Why are ghosts bad at lying? Because you can see right through them!',
        jokeType: 'Wordplay',
    },
    {
        id: 40,
        jokeText:
            "Why can't you give Elsa a balloon? Because she will let it go.",
        jokeType: 'Movies',
    },
    {
        id: 41,
        jokeText:
            "I'm reading a book about anti-gravity. It's impossible to put down!",
        jokeType: 'Science',
    },
    {
        id: 42,
        jokeText:
            'I told my wife she was drawing her eyebrows too high. She looked surprised.',
        jokeType: 'Puns',
    },
    {
        id: 43,
        jokeText:
            'What did one ocean say to the other ocean? Nothing, they just waved.',
        jokeType: 'Wordplay',
    },
    {
        id: 44,
        jokeText:
            'Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.',
        jokeType: 'Wordplay',
    },
    {
        id: 45,
        jokeText: 'How do you organize a space party? You planet!',
        jokeType: 'Science',
    },
    {
        id: 46,
        jokeText:
            "Why don't some couples go to the gym? Because some relationships don't work out.",
        jokeType: 'Puns',
    },
    {
        id: 47,
        jokeText:
            "Parallel lines have so much in common. It's a shame they'll never meet.",
        jokeType: 'Math',
    },
    {
        id: 48,
        jokeText: 'What do you call fake spaghetti? An impasta!',
        jokeType: 'Food',
    },
    {
        id: 49,
        jokeText:
            'Why did the tomato turn red? Because it saw the salad dressing!',
        jokeType: 'Food',
    },
    {
        id: 50,
        jokeText:
            'What do you get when you cross a snowman and a vampire? Frostbite!',
        jokeType: 'Wordplay',
    },
    {
        id: 51,
        jokeText:
            'Why did the golfer bring two pairs of pants? In case he got a hole in one!',
        jokeType: 'Sports',
    },
    {
        id: 52,
        jokeText:
            'Why are ghosts bad at lying? Because you can see right through them!',
        jokeType: 'Wordplay',
    },
    {
        id: 53,
        jokeText:
            "Why can't you give Elsa a balloon? Because she will let it go.",
        jokeType: 'Movies',
    },
    {
        id: 54,
        jokeText:
            "I'm reading a book about anti-gravity. It's impossible to put down!",
        jokeType: 'Science',
    },
    {
        id: 55,
        jokeText:
            'I told my wife she was drawing her eyebrows too high. She looked surprised.',
        jokeType: 'Puns',
    },
    {
        id: 56,
        jokeText:
            'What did one ocean say to the other ocean? Nothing, they just waved.',
        jokeType: 'Wordplay',
    },
    {
        id: 57,
        jokeText:
            'Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.',
        jokeType: 'Wordplay',
    },
    {
        id: 58,
        jokeText: 'How do you organize a space party? You planet!',
        jokeType: 'Science',
    },
    {
        id: 59,
        jokeText:
            "Why don't some couples go to the gym? Because some relationships don't work out.",
        jokeType: 'Puns',
    },
    {
        id: 60,
        jokeText:
            "Parallel lines have so much in common. It's a shame they'll never meet.",
        jokeType: 'Math',
    },
    {
        id: 61,
        jokeText: 'What do you call fake spaghetti? An impasta!',
        jokeType: 'Food',
    },
    {
        id: 62,
        jokeText:
            'Why did the tomato turn red? Because it saw the salad dressing!',
        jokeType: 'Food',
    },
    {
        id: 63,
        jokeText:
            'What do you get when you cross a snowman and a vampire? Frostbite!',
        jokeType: 'Wordplay',
    },
    {
        id: 64,
        jokeText:
            'Why did the golfer bring two pairs of pants? In case he got a hole in one!',
        jokeType: 'Sports',
    },
    {
        id: 65,
        jokeText:
            'Why are ghosts bad at lying? Because you can see right through them!',
        jokeType: 'Wordplay',
    },
    {
        id: 66,
        jokeText:
            "Why can't you give Elsa a balloon? Because she will let it go.",
        jokeType: 'Movies',
    },
    {
        id: 67,
        jokeText:
            "I'm reading a book about anti-gravity. It's impossible to put down!",
        jokeType: 'Science',
    },
    {
        id: 68,
        jokeText:
            'I told my wife she was drawing her eyebrows too high. She looked surprised.',
        jokeType: 'Puns',
    },
    {
        id: 69,
        jokeText:
            'What did one ocean say to the other ocean? Nothing, they just waved.',
        jokeType: 'Wordplay',
    },
    {
        id: 70,
        jokeText:
            'Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.',
        jokeType: 'Wordplay',
    },
    {
        id: 71,
        jokeText: 'How do you organize a space party? You planet!',
        jokeType: 'Science',
    },
    {
        id: 72,
        jokeText:
            "Why don't some couples go to the gym? Because some relationships don't work out.",
        jokeType: 'Puns',
    },
    {
        id: 73,
        jokeText:
            "Parallel lines have so much in common. It's a shame they'll never meet.",
        jokeType: 'Math',
    },
    {
        id: 74,
        jokeText: 'What do you call fake spaghetti? An impasta!',
        jokeType: 'Food',
    },
    {
        id: 75,
        jokeText:
            'Why did the tomato turn red? Because it saw the salad dressing!',
        jokeType: 'Food',
    },
    {
        id: 76,
        jokeText:
            'What do you get when you cross a snowman and a vampire? Frostbite!',
        jokeType: 'Wordplay',
    },
    {
        id: 77,
        jokeText:
            'Why did the golfer bring two pairs of pants? In case he got a hole in one!',
        jokeType: 'Sports',
    },
    {
        id: 78,
        jokeText:
            'Why are ghosts bad at lying? Because you can see right through them!',
        jokeType: 'Wordplay',
    },
    {
        id: 79,
        jokeText:
            "Why can't you give Elsa a balloon? Because she will let it go.",
        jokeType: 'Movies',
    },
    {
        id: 80,
        jokeText:
            "I'm reading a book about anti-gravity. It's impossible to put down!",
        jokeType: 'Science',
    },
    {
        id: 81,
        jokeText:
            'I told my wife she was drawing her eyebrows too high. She looked surprised.',
        jokeType: 'Puns',
    },
    {
        id: 82,
        jokeText:
            'What did one ocean say to the other ocean? Nothing, they just waved.',
        jokeType: 'Wordplay',
    },
    {
        id: 83,
        jokeText:
            'Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.',
        jokeType: 'Wordplay',
    },
    {
        id: 84,
        jokeText: 'How do you organize a space party? You planet!',
        jokeType: 'Science',
    },
    {
        id: 85,
        jokeText:
            "Why don't some couples go to the gym? Because some relationships don't work out.",
        jokeType: 'Puns',
    },
    {
        id: 86,
        jokeText:
            "Parallel lines have so much in common. It's a shame they'll never meet.",
        jokeType: 'Math',
    },
    {
        id: 87,
        jokeText: 'What do you call fake spaghetti? An impasta!',
        jokeType: 'Food',
    },
    {
        id: 88,
        jokeText:
            'Why did the tomato turn red? Because it saw the salad dressing!',
        jokeType: 'Food',
    },
    {
        id: 89,
        jokeText:
            'What do you get when you cross a snowman and a vampire? Frostbite!',
        jokeType: 'Wordplay',
    },
    {
        id: 90,
        jokeText:
            'Why did the golfer bring two pairs of pants? In case he got a hole in one!',
        jokeType: 'Sports',
    },
    {
        id: 91,
        jokeText:
            'Why are ghosts bad at lying? Because you can see right through them!',
        jokeType: 'Wordplay',
    },
    {
        id: 92,
        jokeText:
            "Why can't you give Elsa a balloon? Because she will let it go.",
        jokeType: 'Movies',
    },
    {
        id: 93,
        jokeText:
            "I'm reading a book about anti-gravity. It's impossible to put down!",
        jokeType: 'Science',
    },
    {
        id: 94,
        jokeText:
            'I told my wife she was drawing her eyebrows too high. She looked surprised.',
        jokeType: 'Puns',
    },
    {
        id: 95,
        jokeText:
            'What did one ocean say to the other ocean? Nothing, they just waved.',
        jokeType: 'Wordplay',
    },
    {
        id: 96,
        jokeText:
            'Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.',
        jokeType: 'Wordplay',
    },
    {
        id: 97,
        jokeText: 'How do you organize a space party? You planet!',
        jokeType: 'Science',
    },
    {
        id: 98,
        jokeText:
            "Why don't some couples go to the gym? Because some relationships don't work out.",
        jokeType: 'Puns',
    },
    {
        id: 99,
        jokeText:
            "Parallel lines have so much in common. It's a shame they'll never meet.",
        jokeType: 'Math',
    },
    {
        id: 100,
        jokeText: 'What do you call fake spaghetti? An impasta!',
        jokeType: 'Food',
    },
];
