/* Since Ithe challenge was given even before teaching anything as an actual "challenge",
I took a look at the MDN resource https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring
where everything about how to destructure arrays, objects and so on, is clearly given with examples
I will now attempt to complete this challenge then continue with the video afterwards

Here we need to import the cars array from practice.js which has objects and we need to destructure them
Since we're not using any array indices here, it is clear that we're using array destructuring
Also if we look at the actual object, the top speed is nested inside speedStats object inside the main object
And the top colour is basically the first element in the array for colors by popularity
One more thing, only the model is used as a child of tesla object, the rest are free variables. Based on the docs, we can use */

// CHALLENGE: uncomment the code below and see the car stats rendered

import React from "react";
import ReactDOM from "react-dom";
import cars from "./practice";

const [xhonda, xtesla] = cars;
console.log(xtesla, xhonda);
const [xteslaTopSpeed, xhondaTopSpeed] = cars.map(
  (car) => car.speedStats.topSpeed
);
console.log(xteslaTopSpeed, xhondaTopSpeed);
// const [teslaTopColour, hondaTopColour] = cars.map((car) => {
//   const [value] = car.coloursByPopularity;
//   return value;
// });
// I wrote the above solution but wanted to consolidate it into a one liner so asked GPT
const [xteslaTopColour, xhondaTopColour] = cars.map(
  (car) => car.coloursByPopularity[0]
);
console.log(xteslaTopColour, xhondaTopColour);

// Now that it is done, let me continue with the video

/* The first challenge we have is to get the animals array from data.js and get the two objects as two different variables
Let's first do that and log the output */
import animals from "./data";

const [cat, dog] = animals; // This is the same as: cat=animals[0]; dog=animals[1];
/* Okay we have two objects as output now, and we got them into the variables cat and dog by putting them inside an array literal
While doing this, we need to ensure the names for these variables are unique in the file/scope */
console.log(cat, dog);

/* But what if we want to destructure an object? We instead need to use an object literal */
const { name: catName, sound: catSound } = cat; // Same as using catName=cat.name; catSound=cat.sound;
/* While using this, we need to give the exact name of the key we want to destrcture, as we don't have indices,
and we can specify a variable name after a colon as done above. */
console.log(catName, catSound);

/* We can also set default values for when the object may contain incomplete data but we need to fill everything
We can simply do so by assigning a value at the time of destructuring */
const { jame = "tom", sound = "grr" } = cat; // Renamed the name property to jame because we have name available
console.log(jame, sound);

/* Now what if we have a nested object. Say our cat has another key but its value is an object, we can destructure it
as well inside a single destructuring */
const {
  meow: { day, night },
} = cat;
console.log(day, night);

/* In this same vein, we can also recreate something that looks like useState.
If I create a function in animals,called useAnimals, and return the name of the animal, and a function that produces the sound,
I can import it here and use it similar to using useState */
import { useAnimal } from "./data";

const [nameCat, makeSoundCat] = useAnimal(cat);
console.log(nameCat);
makeSoundCat();

/* Now that we've learnt about desctructuring, I think I need to give the challenge a go again. So I'll rename the variables
in the above solution and log them out, then do it again. Last time I seem to have only used array destructuring */

// Step 1: Get the two objects in separate variables, loads tesla.model and honda.model correctly
const [honda, tesla] = cars;
// I had forgotten that the cars array had honda before tesla and had been doing the opposite, but rest of the code is ditto

// Step 2: Get top speed by destructuring tesla and honda using object destructuring with nesting
const {
  speedStats: { topSpeed: teslaTopSpeed },
} = tesla;
const {
  speedStats: { topSpeed: hondaTopSpeed },
} = honda;

// Step 3: Get top color by destructuring tesla and honda objects and destructing array with nesting, maybe?
const {
  coloursByPopularity: [teslaTopColour],
} = tesla;
const {
  coloursByPopularity: [hondaTopColour],
} = honda;

ReactDOM.render(
  <table>
    <tr>
      <th>Brand</th>
      <th>Top Speed</th>
      <th>Top Colour</th>
    </tr>
    <tr>
      <td>{tesla.model}</td>
      <td>{teslaTopSpeed}</td>
      <td>{teslaTopColour}</td>
    </tr>
    <tr>
      <td>{honda.model}</td>
      <td>{hondaTopSpeed}</td>
      <td>{hondaTopColour}</td>
    </tr>
  </table>,
  document.getElementById("root")
);
