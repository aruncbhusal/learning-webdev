import React, { useState } from "react";

/* Compared the the Class Component, we have a much more readable format here, we simply destructure the array returned by useState method
One of the returned values is a function that can be used to update the state, and the function is hooked to the state easily */

function FunctionalComponent() {
  const [count, setCount] = useState(0);

  function increase() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increase}>+</button>
    </div>
  );
}

export default FunctionalComponent;
