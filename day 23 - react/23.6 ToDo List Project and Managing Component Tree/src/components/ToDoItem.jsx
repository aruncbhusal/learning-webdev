import React, { useState } from "react";

function ToDoItem(props) {
  // Let's add a hook for the clicked state
  const [clicked, setClicked] = useState(false);
  function clickAction() {
    // In order to ensure the list item is deleted on the second click, we'll now use this function
    // In the course the onClick event would call the function that causes the delete but here this function will do so
    // Since we're inside the component function, we can access the function in the props here
    if (clicked) {
      props.deleteItem(props.id);
    }
    // Since we need to identify this item in order to delete, we must send an id, which we need to send as a prop from App.js
    // Could use this package instead as well: https://www.npmjs.com/package/uuid

    // setClicked(!clicked);
    // I think the course meant to make it linethrough and keep it that way, but I'll alternate instead
    // She did the same thing, but she used the callback method:
    setClicked((prev) => !prev);
    // Asked GPT and it said my method works as long as two(or more) of those don't happen together
    // When I use the state directly, all the actions using the state are combined, and only one might take effect
    // So to ensure every time previous value is used for new value, we should prefer the callback method
  }

  return (
    <li
      onClick={clickAction}
      style={{ textDecoration: clicked ? "line-through" : "none" }}
    >
      {props.text}
    </li>
  );
}
// Initially the componnet is a stateless component, and we can't change the value of prop either
// Our goal here is to add a event listener to this item so that when it is clicked, the text is crossed (linethrough css)
// https://www.w3schools.com/cssref/pr_text_text-decoration.php

// Now we want to add a functionality to be able to delete the item we click, so we need to access the parent component.
// We can do this by passing a function as a prop from the parent function, but that function exists in the parent component
// In the course she deletes the list item on click, but that would void all the line through stuff
// So instead I'll call the function when a crossed item is clicked again

export default ToDoItem;
