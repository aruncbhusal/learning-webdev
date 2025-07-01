import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";

// Step 2: Let's import the notes array from the notes.js file and use map to send all the notes
import notes from "../notes";

function App() {
  return (
    <div>
      <Header />
      {notes.map((note) => (
        <Note key={note.key} title={note.title} content={note.content} />
      ))}
      <Footer />
    </div>
  );
}

// Easy

export default App;
