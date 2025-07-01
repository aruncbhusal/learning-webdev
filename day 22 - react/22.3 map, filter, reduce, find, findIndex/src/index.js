import emojis from "./emojipedia";

var numbers = [3, 56, 2, 48, 5];

//Map -Create a new array by doing something with each item in an array.
/* I just had a discussion with GPT after reading the DevDocs for this method. It creates a shallow copy of the function.
When we pass primitive types (numbers, strings, booleans), they are passed by value and not reference so it doesn't matter.
But if the array contains objects or functions, they are passed by reference so what we get is the actual object
If we modify it, the original object may also get modified. We should be careful when dealing with objects and maybe create a new one
a method to recursively create a deep copy is using JSON.parse(JSON.stringify(object)), if no nested objects then ({...object}) works */

/* In this case, let's not go deeper. Map simply allows us to assign each value of an iterable to a function then creates new array from result of each
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
When the callback is called it is passed the current element, the index of the element and the entire array as its arguments */
console.log(
  "Double of numbers: ",
  numbers.map((number) => {
    return number * 2;
  })
);

console.log(
  "Double of numbers: ",
  numbers.map(function (number) {
    return number * 2;
  })
);

// We can also do this with a forEach but the difference is that map returns the array, but forEach only acts on each item
let mapEquiv = [];
numbers.forEach((number) => {
  mapEquiv.push(number * 2);
});

mapEquiv = [];
numbers.forEach(function (number) {
  mapEquiv.push(number * 2);
});
console.log("Double of numbers: ", mapEquiv);

//Filter - Create a new array by keeping the items that return true.
/* Similar to map, this one also returns an array after taking an array, but it only returns the items that return true on a function
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
For example, if we wanted only elements > 30, we could use */
console.log(
  "Greater than 30: ",
  numbers.filter((number) => number > 30)
);

console.log(
  "Greater than 30: ",
  numbers.filter(function (number) {
    return number > 30;
  })
);

// We can also implement this with a forEach:
let filterEquiv = [];
numbers.forEach((number) => {
  if (number > 30) filterEquiv.push(number);
});

filterEquiv = [];
numbers.forEach(function (number) {
  if (number > 30) filterEquiv.push(number);
});
console.log("Greater than 30: ", filterEquiv);

//Reduce - Accumulate a value by doing something to each item in an array.
/* This one returns a value instead of an array. It operates a function on each of the items and returns the final value
Since it needs to keep track of each value after operating on it, it needs an accumulator argument along with the array element */
console.log(
  "Sum of all: ",
  numbers.reduce((accumulator, current) => accumulator + current, 0)
);

console.log(
  "Sum of all: ",
  numbers.reduce(function (accumulator, current) {
    return accumulator + current;
  }, 0)
);

/* The callback function is supplied accumulator, current value, current index and the entire array
We can also give an initial value, which I have given as 0. If it is not given, the first value is the accumulator
In this case, the function is run from the second value instead. */

// We can also do this with a forEach
let reduceEquiv = 0;
numbers.forEach((number) => {
  reduceEquiv += number;
});
console.log("Sum of all: ", reduceEquiv);

reduceEquiv = 0;
numbers.forEach(function (number) {
  reduceEquiv += number;
});
console.log("Sum of all: ", reduceEquiv);

/* The above Array methods have been in JS from before ES6, but the ones below were introduced in ES6 */

//Find - find the first item that matches from an array.
/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
We can use it to find the first value that matches our criteria. For example, if we set a threshold of 30: */

console.log(numbers.find((number) => number > 30));

console.log(
  numbers.find(function (number) {
    return number > 30;
  })
);

// But it is not possible with forEach since we can't break out of it when we find something. We can use a normal for/for...of instead
for (const number of numbers) {
  if (number > 30) {
    console.log(number);
    break;
  }
}

//FindIndex - find the index of the first item that matches.
/* Similar to the one above, but returns index instead
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex */

console.log(numbers.findIndex((number) => number > 30));

console.log(
  numbers.findIndex(function (number) {
    return number > 30;
  })
);

// But it is not possible with forEach since we can't break out of it when we find something. We can use a normal for instead
// Since for...of doesn't have indices, we can't use it unless we use a hack like using array.entries() (as per GPT)
for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] > 30) {
    console.log(i);
    break;
  }
}

/* Now a challenge here is that we need to log out all the values of emoji meanings, but we only want first 100 characters
So we need to truncate before displaying the list. We probably need to use map() here. So first let's import it here */
console.log(emojis.map((emoji) => emoji.meaning.substring(0, 100)));

console.log(
  emojis.map(function (emoji) {
    return emoji.meaning.substring(0, 100);
  })
);
// Since arrow functions are taught in next lesson, let me also have a version that uses the older anonymous function method
// So I will just duplicate everything and have the latter version with the older method
