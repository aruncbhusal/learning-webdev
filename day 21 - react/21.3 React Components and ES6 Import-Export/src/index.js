import React from "react";
import ReactDOM from "react-dom";
// I don't know how many I will have here, but to run any, we can uncomment the one to run and leave the rest commented
// import App from "./components/App";
import App from "./components2/App";

ReactDOM.render(<App />, document.getElementById("root"));

// ReactDOM.render(
//   <div>
//     <h1>My Favourite Foods</h1>
//     <ul>
//       <li>Bacon</li>
//       <li>Jamon</li>
//       <li>Noodles</li>
//     </ul>
//   </div>,
//   document.getElementById("root")
// );
/* The initial starting files had the render as above, but as we start having a lot of components,
having them all in the same render method is tedious. We instead prefer to separate those components then only include them
In order to separate the components, we can create a function, naming convention is PascalCase, and return the component JSX HTML 
We can create a fucntion called Heading and return the h1 element from there, then include Heading in the render function
We can either use the opening and closing tags, or a self closing tag, but it's a convention to use self closing tag
We can read about good practices (style guide) here: https://github.com/airbnb/javascript/tree/master/react
In fact we can not only separate it out as a function but can put it inside another file as well. Continue on Heading.jsx ...

Now our challenge is to also separate the unordered list into another file called List */

/* But this is not the normal way of using React. In most cases, we don't have JSX inside the index.js like this.
We instead only have an App component being rendered, and that component has every other component inside it.
We can see a lot of files in this src folder, it is bloated right now. We can instead create a new folder for components */

/* For the exercise, we have the Greeting Program from before and we need to separate it into components
I will create a new colmponents folder for it, so we can have multiple challenges in the same directory */