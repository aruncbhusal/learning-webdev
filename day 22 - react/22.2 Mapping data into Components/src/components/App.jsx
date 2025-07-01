import React from "react";

/* This file has everything. We need to turn it into a component based format, we'll name the components "Entry"
The array containing everything is inside the emojipedia.js file. I need to export it, and then use it inside the Entry.jsx file
I have to first create that file and create an entry, then set up props
First let me get the emojipedia export working. */
import emojis from "../emojipedia";
/* Now creating the Entry component with everything. We can see the html is as a dl(description list), which semantically identifies our content
It contains dt(description term) and dd(description details). https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dl */
import Entry from "./Entry";

function App() {
  return (
    <div>
      <h1>
        <span>emojipedia</span>
      </h1>

      <dl className="dictionary">
        {emojis.map((emoji) => (
          <Entry key={emoji.id} item={emoji} />
        ))}
      </dl>
    </div>
  );
}
/* The course probably has a function for it, but I tried to do it inline. Guess it works.
But it does look wonky so I think I'll prefer to separate it out into its own function,
Maybe I can even put that function inside the Entry.jsx file, and export it.

The major difference between course solution and mine is that instead of passing each prop one by one,
I instead chose to pass over the entire object and the Entry component would unravel it itself
That is why I didn't need a function, because I bundled all the props, apart from key, which is not a prop anyway*/

export default App;
