import React from "react";
import Entry from "./Entry";
import emojipedia from "../emojipedia";

function App() {
  return (
    <div>
      <h1>
        <span>emojipedia</span>
      </h1>
      <dl className="dictionary">
        {emojipedia.map((emoji) => (
          <Entry
            key={emoji.id}
            emoji={emoji.emoji}
            name={emoji.name}
            description={emoji.meaning}
          />
        ))}
      </dl>
    </div>
  );
}

/* Took me longer than it should have but at least it's over, I had forgotten that I had curly braces around the <Entry>
and was wondering why it's not being returned. After I removed, it became implicit and covered by () instead
Further reading: https://hacks.mozilla.org/2015/06/es6-in-depth-arrow-functions/ */

export default App;
