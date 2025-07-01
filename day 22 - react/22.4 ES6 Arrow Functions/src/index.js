/* Even though I have been using them since god knows when,
the arrow functions have only recently been introduced in the course, so let us use them here */

import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

ReactDOM.render(<App />, document.getElementById("root"));

var numbers = [3, 56, 2, 48, 5];

// First let's work with this numbers array and print out the squares of each using map, but using different methods

// Method 1: Basic method, create a new function and give its name as callback
function square(n) {
  return n * n;
}
console.log(numbers.map(square));

// Method 2: Give the function directly as a callback. We can keep the name or drop it, since I don't want too many variations I'll drop
console.log(
  numbers.map(function (n) {
    // We could also write 'function square(n)' instead
    return n * n;
  })
);

// Method 3: The arrow function, replace the function keyword
console.log(
  numbers.map((n) => {
    return n * n;
  })
);

// Method 3b: But there's still ways to make it shorter
// 1. When we have a single argument only, we don't need to wrap it inside parentheses, but we need it when we have more
// 2. When we only have one line i.e. return, we can omit the curly braces and the return keyword as well
//              console.log(numbers.map(n => n * n));
// Commenting it because the formatter here is adding parentheses around n itself
// We can choose our flavor ourself, depending on the complexity and readability

//Now our task is to replicate the code in comments below into arrow form. I already did this in last one, but let's have at it again

////Map -Create a new array by doing something with each item in an array.
// const newNumbers = numbers.map(function (x) {
//   return x * 2;
// });

const newNumbersMap = numbers.map((x) => x * 2);

//////Filter - Create a new array by keeping the items that return true.
// const newNumbers = numbers.filter(function(num) {
//   return num < 10;
// });

const newNumbersFilter = numbers.filter((num) => num < 10);

//Reduce - Accumulate a value by doing something to each item in an array.
// var newNumber = numbers.reduce(function (accumulator, currentNumber) {
//     return accumulator + currentNumber;
// })

const newNumberReduce = numbers.reduce(
  (accumulator, currentNumber) => accumulator + currentNumber
);

////Find - find the first item that matches from an array.
// const newNumber = numbers.find(function (num) {
//   return num > 10;
// })

const newNumberFind = numbers.find((num) => num > 10);

////FindIndex - find the index of the first item that matches.
// const newNumber = numbers.findIndex(function (num) {
//   return num > 10;
// })

const newNumberIndex = numbers.findIndex((num) => num > 10);

/* Now the final task is to also refactor the app components to use this arrow format.
I think have been using the arrow format since the past modules already so it's just repititive work at this point. */
