import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

ReactDOM.render(<App />, document.getElementById("root"));

//CHALLENGE:
//1. Implement the add note functionality.
//- Create a constant that keeps track of the title and content.
//- Pass the new note back to the App.
//- Add new note to an array.
//- Take array and render seperate Note components for each item.

//2. Implement the delete note functionality.
//- Callback from the Note component to trigger a delete function.
//- Use the filter function to filter out the item that needs deletion.
//- Pass a id over to the Note component, pass it back to the App when deleting.

//This is the end result you're aiming for:
//https://pogqj.csb.app/

// In the challlenge inside the course there were two steps, but looks like there's step by step instructions as well
// I looked at the demo, I think I can do it just fine without those steps. Let me try it and then compare

// The next lesson on improving UI/UX has this as the base but we need to update some things
// So I'll bring in the changes made in the styles.css and some classes, into this project first

// The first thing we need to do is to install some dependencies: Material UI. We can use npm locally
// https://www.npmjs.com/package/@material-ui/icons
// https://www.npmjs.com/package/@material-ui/core
// But since we're using code sandbox, we can easily search and add here
// As I'm using it in a later time, the versions have changed, so I'll instead need to add them to package.json
// And codesandbox will get them for me automatically

// Material UI is simply React components we can use to match Google's Material Theme
// Since we have them installed, now we can use the components in them. For further reading:
// https://mui.com/material-ui/icons/