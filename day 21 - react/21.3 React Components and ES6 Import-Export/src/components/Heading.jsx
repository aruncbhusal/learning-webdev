import React from "react";

function Heading() {
  return <h1>My Favourite Foods</h1>;
}

/* We generally use the main index file as .js and the ones with components as .jsx, even though all have jsx
After we've separated it to another file, we now need this to work, so we also need the react module here
React is what allows the HTML like JSX to work. And now we need to export this to the index.js file
For that, we can use export default and the name of the component (function) without calling it  */
export default Heading;
