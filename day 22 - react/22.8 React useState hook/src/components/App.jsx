import React, { useState } from "react";

function App() {
  // We can use the useState function that comes from React, we can use React.useState or get it separately
  const [count, setCount] = useState(0);
  /* Here I'm using an ES6 syntax called "destructuring", the useState() function (hook) returns an array
  The array has a value and a function. The value is the initial value we must pass to useState function as argument
  We could use const values = useState then use values[0] to get the count value
  But destructuring makes it easier to get the first element, by simply using [value1, value2, ...]
  We can use just [value1] and it would only take the first element from the array
  Now we need to be able to update this state, we can create a function inside this function to do so 
  https://legacy.reactjs.org/docs/hooks-reference.html#usestate */

  function increaseCount() {
    setCount(count + 1);
  }
  /* We can call the setCount with the new value to give to count as a parameter.
  Then we can bind this function which calls setCount as the onClick behavior of the button
  We need to use camelCase for onClick instead of normal html on-click */

  /* A challenge here is to create another button that can be used to decrease the value of count on click
  Should be simple copy paste and replace challenge */
  function decreaseCount() {
    setCount(count - 1);
  }

  return (
    <div className="container">
      <h1>{count}</h1>
      <button onClick={increaseCount}>+</button>
      <button onClick={decreaseCount}>-</button>
    </div>
  );
}

export default App;
