import React from "react";
import ClassComponent from "./ClassComponent";
import FunctionalComponent from "./FunctionalComponent";

/* There are two ways of creating components and rendering them, and it was because we could only add state to Class Component
But it changed in React 16.8 when they introduced hooks, which allowed functional components to be able to use states as well
The different implementations of the same thing are inside Class Component and Functional Component files
This file has the ClassComponent component returned, but we could also have what we already use and return the functional component */
//           function App() {
//               return <FunctionalComponent />;
//            }
// The difference is that we create a component in Class method by extending a built in React Component class

class App extends React.Component {
  render() {
    return <ClassComponent />;
  }
}

export default App;
