import React from "react";
import DeleteIcon from '@material-ui/icons/Delete';

function Note(props) {
  const { title, content } = props.note;

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

export default Note;
