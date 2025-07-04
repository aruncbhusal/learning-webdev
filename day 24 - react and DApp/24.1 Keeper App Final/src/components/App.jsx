import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {
  // First thing is to have a variable that stores the notes. Let's create a hook for that variable now
  const [notes, updateNotes] = useState([]);

  // Let's just create a new array with all the notes within this one
  function addNote(note) {
    updateNotes((prev) => [...prev, note]);
  }
  // I've added this BEFORE adding any functionality inside the form, so it's like a target I'm working towards
  // The addNote function should be passed a note in an object format, which contains note title and content

  // Let's also create a basic delete functionality, which means each note should have an id
  function deleteNote(id) {
    updateNotes((prev) => prev.filter((note, idx) => idx !== id));
  }
  // I will simply use the note index as the identifier
  // Now I need to simply use a map on the note and since we already have a note component, we can send it the function and id
  // It will contain the title and content itself, no need to pass from here

  return (
    <div>
      <Header />
      <CreateArea add={addNote} />
      {/* <Note key={1} title="Note title" content="Note content" /> */}
      {notes.map((note, idx) => (
        <Note key={idx} id={idx} note={note} delete={deleteNote} />
      ))}
      <Footer />
    </div>
  );
}
// I think we're kind of done here, let me make the form work now
// Yep, works as expected, now to compare with course solution

// To add a background image for the app, we can use https://www.transparenttextures.com/
// Select a background and copy its url to paste as a background-img in the css

export default App;
