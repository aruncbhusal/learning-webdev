import React, { useState } from "react";
// We need to incorporate an add icon instead of the text for add.
import AddIcon from "@material-ui/icons/Add";
// We can also use FAB (Floating Action Button) which has its own styling applied
//https://mui.com/material-ui/react-button/#floating-action-buttons
import Fab from "@material-ui/core/Fab";
// Now we can replace the button element with this
// We can also add animations for the button using the Zoom API
// https://v4.mui.com/api/zoom/#zoom-api
import Zoom from "@material-ui/core/Zoom";

function CreateArea(props) {
  // First, we have a prop that has the function to be called when passing a new note
  // Let's now create hooks for the input and textarea fields
  const [note, updateNote] = useState({
    title: "",
    content: "",
  });

  // Now we need to be able to update the note with the values, then use the values wtih controlled components
  function handleChange(event) {
    // This should handle the change event on both input and textarea
    const { value, name } = event.target;
    updateNote((prev) => ({ ...prev, [name]: value }));
  }
  // Simple enough, maybe

  // But we also need to prevent the page from being refreshed and send the info over to App when button pressed
  function handleSubmit(event) {
    // I was wondering why the form refresh wasn't being prevented, noticed event parameter was missing
    event.preventDefault();
    // I had to add this above, because we return if title is empty but in that case it will refresh

    // Let's first send the content in the note object to the App using the function in prop
    // But before that let's ensure the title is not empty, we can have empty content but title should not be
    // if (!note.title.trim().length) return;
    // Initially I wanted to not allow when title was empty, but then I thought that we can allow any one field to be empty
    if (!(note.title.trim().length + note.content.trim().length)) return;

    props.add(note);

    // After it is added, we now need to clear the current note state. Then we prevent the reload
    updateNote({
      title: "",
      content: "",
    });
  }
  // I'll come back to this later if needed, but for now I think this is it, now to work on Note component

  // To deal with the final challenge of only showing content until clicked into the box
  // I think I will create a single boolean, which when true shows everything
  const [isClicked, setIsClicked] = useState(false);

  function handleClick() {
    setIsClicked(true);
    // I had set it to !prev but since I don't want to become false when clicked again inside the box, had to use true
  }
  // Now that this is done, we can make the different components depend on this hook so that they are re-rendered on change
  // I need to do the following things:
  // 1. Only show title input when true
  // 2. Content input rows=1 if false, 3 if true
  // 3. Add button shown only if true, zoom in becomes true when true

  // Now an addition of my own, I want to collapse the field if the title is empty and user clicks out of the boxes
  // function handleBlur() {
  //   if (!note.title.trim().length) setIsClicked(false);
  // }
  // Okay this looks kind of out of scope right now, not because it is not possible, but because it covers more concepts

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

/* Now our final challenge is to have a small section only for content, if clicked we finally show title input and button
The button should only zoom then. */

export default CreateArea;
