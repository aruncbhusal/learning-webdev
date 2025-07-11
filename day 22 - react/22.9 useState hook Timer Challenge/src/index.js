/* We have two challenges this time, I will need to tackle one at a time
I will comment out the code then start again for the next challenge maybe
The code will be in App.jsx. We are already given the required functions for the challenge here
This should be pretty simple as well. */

import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

ReactDOM.render(<App />, document.getElementById("root"));

//Challenge:
//1. Given that you can get the current time using:
let time = new Date().toLocaleTimeString();
console.log(time);
//Show the latest time in the <h1> when the Get Time button
//is pressed.

//2. Given that you can get code to be called every second
//using the setInterval method.
//Can you get the time in your <h1> to update every second?

//e.g. uncomment the code below to see Hey printed every second.
// function sayHi() {
//   console.log("Hey");
// }
// setInterval(sayHi, 1000);
