import React from "react";

/* In this code, we can see the code just to set the state on a single state variable count and handle using a function
For a simple functionality, we need to extend the Component, inherit using constructor and super(), define a state variable in class
Then we also need to bind a function to the entire class(object)
Inside the function we need to use the builtin setState method to set the value of the state variable (an object property of the class)
Finally we must have a render method which returns the HTML with the mutable state variable
In the course she didn't describe anything about how a class works or anything and she just gave a heads up about how we might find these in the wild */

class ClassComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      count: 0,
    };
    this.increase = this.increase.bind(this);
  }

  increase() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div>
        <h1>{this.state.count}</h1>
        <button onClick={this.increase}>+</button>
      </div>
    );
  }
}

export default ClassComponent;
