/* I was thinking of doing this part inside the react app locally
But since this project is divided into multiple parts, I thought I may as well do it in the sandbox and do next part locally
The index has the root and a link to styles and indes.js. styles has the required styles, and this one has TODOs
I'll take care of each one at a time, and try to achieve the final look */

//1. Create a new React app.
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

//2. Create a App.jsx component.
//3. Create a Header.jsx component that renders a <header> element
//to show the Keeper App name in an <h1>.
//4. Create a Footer.jsx component that renders a <footer> element
//to show a copyright message in a <p> with a dynamically updated year.
//5. Create a Note.jsx component to show a <div> element with a
//<h1> for a title and a <p> for the content.
//6. Make sure that the final website is styled like the example shown here:
//https://l1pp6.csb.app/
// (Okay all done, and it looks pretty much identical. Simple stuff.)

//HINT: You will need to study the classes in teh styles.css file to appy styling.

// Since we have React16 here, we can use ReactDOM.render() here
ReactDOM.render(<App />, document.getElementById("root"));
