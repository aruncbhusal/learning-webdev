import React, { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";

function CreateArea(props) {
  const [note, updateNote] = useState({
    title: "",
    content: "",
  });

  function handleChange(event) {
    const { value, name } = event.target;
    updateNote((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!(note.title.trim().length + note.content.trim().length)) return;

    props.add(note);
    updateNote({
      title: "",
      content: "",
    });
  }

  const [isClicked, setIsClicked] = useState(false);
  function handleClick() {
    setIsClicked(true);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="create-note">
        {isClicked && (
          <input
            name="title"
            placeholder="Title"
            onChange={handleChange}
            value={note.title}
          />
        )}
        <textarea
          name="content"
          placeholder="Take a note..."
          rows={isClicked ? 3 : 1}
          onChange={handleChange}
          value={note.content}
          onClick={handleClick}
        />
        {isClicked && (
          <Zoom in={isClicked}>
            <Fab type="submit">
              <AddIcon />
            </Fab>
          </Zoom>
        )}
      </form>
    </div>
  );
}

export default CreateArea;
