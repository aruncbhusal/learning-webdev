import React from "react";
import Form from "./Form";

/* We already have the challenges.
We need to display Login if the user is Registered
But we need to display both confirm password and register if not
What if we send in the userIsRegistered as a prop to Form and do the thing there */

var userIsRegistered = false;

function App() {
  return (
    <div className="container">
      <Form registered={userIsRegistered} />
    </div>
  );
}

export default App;
