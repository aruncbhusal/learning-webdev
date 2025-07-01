/* When we need to "react" to changes in the state of something in the UI, we need to make use of states
The use of these states is called declarative programming. When we set a component's value/attribute based on a variable,
we can change the value of the variable and the compoennt will change
This is different from the imperative programming we have been doing so far, in which we tell the code what to do
We set events and on the occurence of those events we change the state of the components.
But in using state variables, we need to note that the change doesn't occur on the change of the state variable
It is only done when the page/component is re-rendered. In order to make the component dependent on the state, we need to use Hooks */

import React from "react";
import ReactDOM from "react-dom";

// ReactDOM.render(
//   <div className="container">
//     <h1>0</h1>
//     <button>+</button>
//   </div>,
//   document.getElementById("root")
// );

/* We want something to happen when we press the + button. What we can do is the following: */

// let count = 0;

// function increaseCount() {
//   count++;
//   ReactDOM.render(
//     <div className="container">
//       <h1>{count}</h1>
//       <button onClick={increaseCount}>+</button>
//     </div>,
//     document.getElementById("root")
//   );
// }

// ReactDOM.render(
//   <div className="container">
//     <h1>{count}</h1>
//     <button onClick={increaseCount}>+</button>
//   </div>,
//   document.getElementById("root")
// );

/* What is happening here is that we're setting the initial value of count to 0, rendering the count
Then on each click of the button, we're calling the increaseCount function which increases the value of 0
But at that point the value does not get updated in the DOM, so we need to render it again
But this code is very bulky so it is not preferred. Instead we use something called useState
For that let's create a new component for the App and take the code there */

import App from "./components/App";

ReactDOM.render(<App />, document.getElementById("root"));
