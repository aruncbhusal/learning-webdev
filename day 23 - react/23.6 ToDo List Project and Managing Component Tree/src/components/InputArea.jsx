import React, { useState } from "react";

function InputArea(props) {
  // First of all, since this component doesn't have any props, we've brought all the things from the parent component here
  // We need to send them instead of them being here on their own magically

  // Next let's isolate the things that only affects this component, like the state of the text
  const [inputText, setInputText] = useState("");

  function saveState(event) {
    const input = event.target.value;
    setInputText(input);
  }

  return (
    <div className="form">
      <input onChange={saveState} type="text" value={inputText} />
      <button
        onClick={() => {
          props.add(inputText);
          // We also need to handle the emptying of the textarea here
          setInputText("");
        }}
      >
        <span>Add</span>
      </button>
    </div>
  );
}

export default InputArea;
