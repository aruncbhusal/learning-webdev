import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
// Let's import the backend functions here
import { dkeeper } from "../../../declarations/dkeeper";

function App() {
  const [notes, updateNotes] = useState([]);

  function addNote(note) {
    updateNotes((prev) => {
      // Before we return the new array, we can also pass the current ntoe to the backend
      dkeeper.createNote(note.title, note.content);
      // Currently, the new note is added at the end, but in Motoko list, it is added at the start
      // The notes being added at the beginning is actually the expected behavior, so we need to change this a bit
      // return [...prev, note]
      return [note, ...prev];
    });
  }

  /* Currently our updateNote is run only when notes are created or deleted, but we also want to execute when reloaded
  This can be done by making use of another React Hook called useEffect which takes a function and an array
  The function is run each time the component refreshse (in this case App), and array to reload when anything in that array changes */

  useEffect(() => {
    // Since this function itself isn't async, we need to call an async function from here
    readNotes();
  }, [])

  async function readNotes() {
    // We can then call the query function in the backend to get hold of the notes
    const receivedNotes = await dkeeper.readNotes();
    // Then we need to update the notes at the first render of the page
    updateNotes(receivedNotes);
  }

  function deleteNote(id) {
    updateNotes((prev) => {
      // Apart from updating this way, we also need to update on the backend by using the available function
      dkeeper.deleteNote(id);
      return prev.filter((note, idx) => idx !== id)
    });
  }

  return (
    <div>
      <Header />
      <CreateArea add={addNote} />
      {notes.map((note, idx) => (
        <Note key={idx} id={idx} note={note} delete={deleteNote} />
      ))}
      <Footer />
    </div>
  );
}

export default App;
