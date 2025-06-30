//2. Create a App.jsx component.
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";

function App() {
  return (
    <div>
      <Header />
      <Note />
      <Footer />
    </div>
  );
}

// One thing to note is that when applying className or style or anything,
// we do it to HTML elements not React components

export default App;
