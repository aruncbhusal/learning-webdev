import React, { useState } from "react";

// Since we now have a todo item component, let's import that
import ToDoItem from "./ToDoItem";

// Now that we have a form component, let's import that too
import InputArea from "./InputArea";

function App() {
  //1. When new text is written into the input, its state should be saved.
  // const [inputText, setInputText] = useState("");

  // function saveState(event) {
  //   const input = event.target.value;
  //   setInputText(input);
  // }

  //2. When the add button is pressed, the current data in the input should be added to an array.
  const [todoList, updateTodoList] = useState([]);
  // Since we're sending the text from the component, we need to receive it as well
  function addEntry(inputText) {
    // updateTodoList((prev) => [...prev, <li>{inputText}</li>]);
    // Something felt off and upon asking GPT, it told me we're not meant to store JSX elements inside a list, though it works
    // I should instead just use the value like I used to, but this felt cool for the 5 mins it lasted

    // On testing, realized we're letting empty stuff being added. Let's not allow that
    if (!inputText.trim().length) return;
    updateTodoList((prev) => [...prev, inputText]);
    // Need to also reset the input text state
    // setInputText("");
    // We will also need to handle this inside the component
  }

  /*
        <ul>
          {todoList.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
        */
  // Using this didn't work and the state of the ul didn't change, which means we need to add state to it
  // Our job is to switch the todoList we have for a state variable which is an array, and it is updated with the spread operator
  // That array will have the list elements, rather than only the input text. Let me try that

  // Let's add the deletion functionality now
  function deleteItem(id) {
    // We can use the filter method to save a new array but without the one to be deletedd
    updateTodoList((prev) => prev.filter((item, idx) => idx !== id));
  }

  return (
    <div className="container">
      <div className="heading">
        <h1>To-Do List</h1>
      </div>
      <InputArea add={addEntry} />
      <div>
        {/*3. The <ul> should display all the array items as <li>s*/}
        <ul>
          {/* Completely forgot about the key we need to give when using map */}
          {todoList.map((item, index) => (
            <ToDoItem
              key={index}
              id={index}
              text={item}
              deleteItem={deleteItem}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

/* The next lesson on managing a component tree starts with this final todoList app, so we'll continue here
The first task is to separate out the list item into a new component file called ToDoItem */

/* The next challenge is simply taking out the input area, and we need to make it work. Here's the challenge verbatim: */

//CHALLENGE: I have extracted the Input Area, including the <input> and
//<button> elements into a seperate Component called InputArea.
//Your job is to make the app work as it did before but this time with the
//InputArea as a seperate Component.

// DO NOT: Modify the ToDoItem.jsx
// DO NOT: Move the input/button elements back into the App.jsx

//Hint 1: You will need to think about how to manage the state of the input element
//in InputArea.jsx.
//Hint 2: You will need to think about how to pass the input value back into
//the addItem() function in App.jsx.

// The first thing I'll do is to seperate out the InputArea.jsx file and replicate the set up as far as possible

export default App;
