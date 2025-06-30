//5. Create a Note.jsx component to show a <div> element with a
//<h1> for a title and a <p> for the content.

import React from "react";

function Note() {
  return (
    <div className="note">
      <h1>Example Note</h1>
      <p>Today I have learnt quite a lot of things about React.</p>
    </div>
  );
}
// There is class based styling for this component, certainly because there's more than one Note components in our app.

export default Note;
