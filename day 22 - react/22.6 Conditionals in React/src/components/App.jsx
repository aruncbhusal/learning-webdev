/* We start with a single App.js
What if we have a isLoggedIn variable here which is a boolean
We want the h1 to be shown if it is true, else we show the form
One way to do so is to use a function and return compoennts conditionally
if true then h1 if false then render. But it is bulky

First challenge here is to take the form out as a separate component,
and from inside the form, take out the input as a separate component as well
Let's create the two component files and use the principle of Single responsibility
More on it: https://en.wikipedia.org/wiki/Single-responsibility_principle */

let isLoggedIn = true;

/* After the challenge is done, we still don't have a way to render conditionally
Since we MUST use an expression inside the curly braces, we can't use something like an if statement
But we can use the ternary operator, which to be honest, I might have used in a past lesson
But let's assume I haven't. We can use:
(expression that returns a boolean) ? (expression if true) : (expression if false)
In this case the expression that returns a boolean is isLoggedIn === true , or simply isLoggedIn
The expression we need if it is true is the h1, and if false we need the loginform
So finally we can use them as below: 
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator */

/* Now what if we want to display something only when something is true,
We can simply use null for the expression being false. Let's see an example:
if we want to display "It is night" when it is past 6pm, we can use it as below */
const timeNow = new Date().getHours();

/* But instead of ternary operator, we can also use a neat programming trick
The && function, which I have already used previously, is used for conditionals,
when both expressions on the left and rihgt are true, it evaluates to true
But if the left expression is false, it doesn't evaluate the second one at all
We can use this to our advantage, if we set left side as the expression to check
Then the right side can be the expression we want to evaluate if it is true
If it is false it won't be evaluated. Thus we now don't need to use null 
https://legacy.reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator */

import React from "react";
import LoginForm from "./LoginForm";

function App() {
  return (
    <div className="container">
      {isLoggedIn ? <h1>Hello</h1> : <LoginForm submit="Login" />}
      {/* Ternary operator for true or nothing */}
      {timeNow >= 18 ? <h1>It's Night</h1> : null}
      {/* AND (&&) operator for true or nothing */}
      {timeNow >= 18 && <h1>It's Night</h1>}
    </div>
  );
}

export default App;
