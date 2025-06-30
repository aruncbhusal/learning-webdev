/* In this introduction sandbox, we have an index.html which has styles.css and index.js connected to it but they are empty
The index.html has a single div called root, which will contain everything we create using React.
We won't be touching index.html and will work here. First we need to have react and react-dom as dependencies
That is already done by the sandbox, but if I were using a local IDE like VSCode, I'd have to npm install
Since this is an old module, we're still using the CJS format, I'll follow that for now as well. */

// var React = require("react");
// var ReactDOM = require("react-dom");
// We can use the ESM syntax so why not
import React from "react";
import ReactDOM from "react-dom";

// In order to render something into the DOM, we need to use:
ReactDOM.render(<h1>Hello World</h1>, document.querySelector("#root"));
// The first argument is what and the second is "inside where", a third argument for callback is not given here
/* Notice that we are able to write plain HTML directly to our JS file. We don't even need quotes or anything
This is made possible by Babel, a JavaScript compiler, which takes this JS file (JSX) and compiles it into vanilla JS
It is included inside React. We can look at https://babeljs.io/repl to convert modern JS syntax into browser understandable
We can write ES6 code and it would ensure it is compatible with even the old versions of Internet Explorer by compiling our code
In fact we can use the new ESM method for using packages. I will use them above */

// Because of Babel, we can use the render method above, instead of writing these many lines of code to do the same thing
const h1 = document.createElement("h1");
h1.innerText = "Hello Again";
document.getElementById("root").appendChild(h1);

// But the render method can only have a single html element and doesn't work if I have a <p> tag afterwards.
// I can however, wrap all the elements inside a single div so that they all are rendered
ReactDOM.render(
  <div>
    <h1>Hello, but this time later</h1>
    <p>Did you not hear me say hello??</p>
  </div>,
  document.getElementById("root")
);
// Something to note here is that even though I have two render methods, only the latter one is executed and the order of the code matters

// I tried updating react and react-dom and the render method broke. Possible that they are deprecated from 16.11 to 19?

/* There was a challenge to create a webpage which has one heading and three unordered list items about anything
Since we already have this file, I didn't want to go through the hassle of creating another one. So I'll do it here */

ReactDOM.render(
  <div>
    <h1>Books To Read This Semester</h1>
    <ul>
      <li>Shirishko Ful</li>
      <li>The Time Machine</li>
      <li>The Prophet</li>
    </ul>
  </div>,
  document.getElementById("root")
);

/* Next, in JSX, we can not only insert HTML inside a JS file, but we can also insert JS into that HTML inside the JS
We can simply wrap the expression with curly braces and it will be interpreted as JavaScript code instead of plain html
Our challenge here is to add a heading and paragraph element, heading says hello <your name> and paragraph has a lucky number */
const fName = "John";
const lName = "Von Neumann";
const luckyNum = Math.floor(Math.random() * 10); // A number from 1 to 10, course didn't ask for a random number but I did

ReactDOM.render(
  <div>
    <h1>Hello, {fName + " " + lName}</h1>
    <p>The lucky number for today is {luckyNum}</p>
  </div>,
  document.getElementById("root")
);

/* We can have an expression inside the braces, which means instead of the variable luckyNum, I could simply use Math.floor(..)
But we can't use statements, like if, for or others, because they do not evaluate to a certain value and instead dictate control
A challenge was to display both first and last name, so I'll just edit the code above
In the challenge, I could have used "{fName} {lName}" instead,
or I could have used ES6 string interpolation with `${fName} ${lName}` as well, but I chose to do it the simple way */

/* Another challenge I will do in this same file: two paragraph elements one with name and another with copyright and current year
I think I used it pretty recently so it should be general knowledge to me currently. Let's see */
const image = "https://picsum.photos/200";
ReactDOM.render(
  <div>
    <p className="red" contentEditable spellCheck="false">
      Created by {`${fName} ${lName}`}
    </p>
    <p style={{ color: "green", fontSize: "2rem" }}>
      Copyright &copy; {new Date().getFullYear()}
    </p>
    <div className="images">
      <img
        src="https://images.unsplash.com/photo-1493612276216-ee3925520721"
        alt="Bulb"
      />
      <img
        src="https://images.unsplash.com/photo-1494253109108-2e30c049369b"
        alt="Blue Lemon"
      />
      <img
        src="https://images.unsplash.com/reserve/LJIZlzHgQ7WPSh5KVTCB_Typewriter.jpg"
        alt="Typewriter"
      />
    </div>
    <img src={image + "?grayscale"} alt="Random image" />
  </div>,
  document.getElementById("root")
);

/* To add styling to our rendered elements, we can add classes and style the classes in css
Though the normal way of adding classes i.e. class="some-class" somehow works, it is not intended to be used.
We should instead use className. Since we're working with JS, all the attributes should be camelCased instead of single word
I'll not create a new render but add the class/attributes in the p tag above
We used the contentEditable attribute, which in normal html is contenteditable.
A challenge was to turn off the red squiggly lines when we type rubbish instead of the current text.
We can simply get the spellCheck attribute and turn it false

The next challenge is to add three random images from the web, and use css to make them all 100x100px squares.
I will just add those into the same render, no new one here.
I added a class to the div, but she added in each img tag. We can simply hold Alt and click to edit with multiple cursors at once.
We can also use JS expressions as attribute values. Let me create a new image url and use it as a new img tag
We need to be careful about the closing / because unlike HTML, we must have a closing tag, if self closing i.e. < />

We can also use inline styles, and it is useful in cases when we want to update the styles on the fly to react to changes
Instead of the normal html way of writing styles="color: red; border: 1px solid black;" , we need to instead pass a JS object
In order to use JS, we need to enclose with curly braces, so an object inside it would make it two curly braces
The css properties are strings, and now separated by comma instead
We can either put the object directly, which is what I did, or we can store the object in a variable and use the variable
Using a variable lets us change the styling without having to touch anything in the JSX HTML */

/* We now have a styling challenge, where we need to create a h1 then render good morning in red if time is from 12am-12pm,
afternoon in green if 12-6pm, night in blue if 6pm to 12am  */

const timeNow = new Date().getHours();
let text = "Good ";
const headingColor = {
  color: "red",
};
if (timeNow < 12) {
  text = text + "morning";
  headingColor.color = "red";
} else if (timeNow < 18) {
  text = text + "Afternoon";
  headingColor.color = "green";
} else {
  text = text + "night";
  headingColor.color = "blue";
}

ReactDOM.render(
  <div>
    <h1 className="heading" style={headingColor}>
      {text}
    </h1>
  </div>,
  document.getElementById("root")
);
