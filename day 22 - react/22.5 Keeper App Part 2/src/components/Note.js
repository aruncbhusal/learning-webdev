import React from "react";

// First thing we need to do is remove the placeholder text and use props instead so we can feed data here

function Note(props) {
  return (
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
    </div>
  );
}

export default Note;
