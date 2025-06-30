import React from "react";
import ReactDOM from "react-dom";

// Now to import all the things
import add, { multiply, subtract, divide } from "./calculator";
// I could also ditch the default and export everything inside the braces instead

ReactDOM.render(
  <ul>
    <li>{add(1, 2)}</li>
    <li>{multiply(2, 3)}</li>
    <li>{subtract(7, 2)}</li>
    <li>{divide(5, 2)}</li>
  </ul>,
  document.getElementById("root")
);
