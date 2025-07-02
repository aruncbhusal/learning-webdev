import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

ReactDOM.render(<App />, document.getElementById('root'));

//CHALLENGE: Make the code in App.jsx work.
//The final app should have a single contact
//with fName, lName and email.

//HINT: You'll need to apply the following things you learnt:
//1. Using JS Objects with state.
//2. Making use of previous state when changing state.
//3. Working with forms in React.
//4. Handing events

// The code is in the App.js, but there is another concept introduced in ES6 that is very useful
// It is called the spread operator (...) which can be used with an array or an object
// It spreads out all the elements of an array or all the key-value pairs of an object, which we cann use inside another
// Let's say we have an array and an object
const array1 = ['Blue', 'Green', 'Yellow'];
const object1 = {
    one: 'Gandalf',
    two: 'Sauron',
};

// We can now use the spread operator to create a new array, or a new object, which contains all elements of these
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
const array2 = ['Red', ...array1, 'Orange'];
const object2 = {
    ...object1,
    three: 'Saruman',
};
console.log(array2);
console.log(object2);
// We can see that the array2 and object2 contain array1 and object2's elements and key-value pairs respectively
// Inside the array, we were able to insert it in the middle as well.
// We can now use this inside App.js to make the code brief
