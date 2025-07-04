import React from "react";
// Since we can use Material Icons, we can simply import a delete icon component to replace the text we have
import DeleteIcon from "@material-ui/icons/Delete";
// Found at https://v4.mui.com/components/material-icons/

function Note(props) {
  // Initially the props sent were title and content, but we now only need to send the note
  // We can use the note object directly by destructuring. Let's first send it from App and get it here
  const { title, content } = props.note;

  // Now the next job is to make the DELETE button work, maybe we can simply send the id to the prop function
  // How about this time I call the prop function from onClick attribute instead of here

  return (
    <div className="note">
      <h1>{title}</h1>
      <p>{content}</p>
      <button
        onClick={() => {
          props.delete(props.id);
        }}
      >
        <DeleteIcon />
      </button>
    </div>
  );
}
// Now to test it

export default Note;
