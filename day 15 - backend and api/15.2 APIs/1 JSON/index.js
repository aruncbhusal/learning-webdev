/* API (Application Programming Interface) is a way to communicate between two softwares that might use different technologies
We might have a server that needs information from another server on the internet or within our own network
An API facilitates this data transfer even if your server and the server to interact with are written with different languages
There are many choices for APIs, each with their own rules, like GraphQL, SOAP, etc
But the most popular API for web development is REST, which works with HTTP requests like GET, POST, PUT, PATCH, DELETE
If a service has an API available, we can use them by following their format of endpoint, data and request type
We can look at their API documentation to figure that out

A task here was to follow the API docs for the "Where the ISS at" API, which gives current location of the ISS
We can set the endpoint as https://api.wheretheiss.at/v1/satellites/25544 and make a GET request with Postman
The response is a json with latitude, longitude and other information about the ISS */

/* In our web app, when our frontend needs some resource, it makes a request to the backend and the backend responds
This is effectively a private API because we don't expose it for public use
Some servers expose their APIs so that they can be requested from some other place. These APIs are public APIs

The next task is to again use Postman and this time make a request to an endpoint given in https://bored-api.appbrewery.com/
An API server may have different APIs set up for different purposes, like in this API, random endpoint returns a random activity
filter endpoint allows filtering with criteria, activity endpoint allows to get activity by key. Let's use random in Postman
Most free APIs with no authentication rate limit the users to limit misuse.

An API can look like: base_url/endpoint?query1=value&query2=value
Here the base URL is the url that is serving the API, the endpoint is their designated API endpoint
And we can add query when available to provide the sever some value ourselves, useful when filtering/searching
Now we need to use this knowledge to create a GET request to /filter endpoint on the bored API
It has two query parameters available, type and participants, and we can use them both to filter for "social" and "2 people"

We can also have something like: base_url/endpoint/{path-parameters}
The endpoint is usually a fixed string, that does what it is specified to do, but path parameters can be used to identify a resource
Like ids, names, or other attributes, and in the case of the bored API, it is used to identify the activities
We can place the id of any activity, and it will give us the details about the activity in question */

/* JSON (JavaScript Object Notation)
For data to be sent on the web, we need to have a standardized format, and a easily readable format is the JSON
It looks essentially like a JavaScript object, but its keys are all strings, values can be strings or numbers or objects, etc
We can use the JSON module in JS to convert a JS object to JSON using JSON.stringify(object) and JSON to object by JSON.parse(json)

In this project, our job is to ensure the recipe is displayed properly, from the recipe.json file into the index.ejs file
I will not look at solution files or run the code because I've seen what I needed to in the video.
Something I noticed is that she had used form to send the value over, but she did it differently from my approach in the blog project
I had used two different forms for two different values, but she uses the same form with different values.
Well I also had two different routes to go, edit and delete. Something to know for next time when I have two buttons for the same route maybe */

import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

//Step 1: Run the solution.js file without looking at the code.
//Step 2: You can go to the recipe.json file to see the full structure of the recipeJSON below.
// I saw the JSON structure, we can use jsonviewer.stack.hu to see the structure of JSON well
const recipeJSON =
    '[{"id": "0001","type": "taco","name": "Chicken Taco","price": 2.99,"ingredients": {"protein": {"name": "Chicken","preparation": "Grilled"},  "salsa": {"name": "Tomato Salsa","spiciness": "Medium"},  "toppings": [{"name": "Lettuce",  "quantity": "1 cup",  "ingredients": ["Iceberg Lettuce"]  },      {"name": "Cheese",  "quantity": "1/2 cup",  "ingredients": ["Cheddar Cheese", "Monterey Jack Cheese"]  },      {"name": "Guacamole",  "quantity": "2 tablespoons",  "ingredients": ["Avocado", "Lime Juice", "Salt", "Onion", "Cilantro"]  },      {"name": "Sour Cream",  "quantity": "2 tablespoons",  "ingredients": ["Sour Cream"]  }      ]    }  },{"id": "0002","type": "taco","name": "Beef Taco","price": 3.49,"ingredients": {"protein": {"name": "Beef","preparation": "Seasoned and Grilled"},  "salsa": {"name": "Salsa Verde","spiciness": "Hot"},  "toppings": [{"name": "Onions",  "quantity": "1/4 cup",  "ingredients": ["White Onion", "Red Onion"]  },      {"name": "Cilantro",  "quantity": "2 tablespoons",  "ingredients": ["Fresh Cilantro"]  },      {"name": "Queso Fresco",  "quantity": "1/4 cup",  "ingredients": ["Queso Fresco"]  }      ]    }  },{"id": "0003","type": "taco","name": "Fish Taco","price": 4.99,"ingredients": {"protein": {"name": "Fish","preparation": "Battered and Fried"},  "salsa": {"name": "Chipotle Mayo","spiciness": "Mild"},  "toppings": [{"name": "Cabbage Slaw",  "quantity": "1 cup",  "ingredients": [    "Shredded Cabbage",    "Carrot",    "Mayonnaise",    "Lime Juice",    "Salt"          ]  },      {"name": "Pico de Gallo",  "quantity": "1/2 cup",  "ingredients": ["Tomato", "Onion", "Cilantro", "Lime Juice", "Salt"]  },      {"name": "Lime Crema",  "quantity": "2 tablespoons",  "ingredients": ["Sour Cream", "Lime Juice", "Salt"]  }      ]    }  }]';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.post('/recipe', (req, res) => {
    //Step 3: Write your code here to make this behave like the solution website.
    // Since we already have the recipeJSON variable here, we can just convert that into a JS object for us
    const recipeObject = JSON.parse(recipeJSON);
    // Now the job is to get the value passed by the form
    const ingredient = req.body['choice'];
    // I could write an if-else block here but what if I just search through the object
    var recipeToSend;
    recipeObject.forEach((recipe) => {
        if (recipe['name'].split(' ')[0].toLowerCase() === ingredient) {
            recipeToSend = recipe;
            // Since I've already gone overboard by adding split, I may as well add a return
        }
    });
    res.render('index.ejs', {
        recipe: recipeToSend,
    });
    //Step 4: Add code to views/index.ejs to use the recieved recipe object.
});
// I made this a lot harder than it should have, trying to return from a forEach??
// In the solution, she simply used a switch statement to check the received value for choice
// Then she sets the data to 0 for chicken, 1 for beef and 2 for fish. I had to overcomplicate this for scalability
// That's just my excuse at this point
// In her index.ejs, she used the dot notation to access the object keys, but I used the bracket method
// That is what made me incredibly slow during this one.

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
