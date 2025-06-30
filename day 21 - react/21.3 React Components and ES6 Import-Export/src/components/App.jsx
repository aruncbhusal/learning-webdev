import React from "react";
/* We have separated the heading so we need to import it from the file we created.
We need not use the file extension because it is understood */
import Heading from "./Heading";
import List from "./List";

function App() {
  return (
    <div>
      <Heading />
      <List />
    </div>
  );
}

export default App;
