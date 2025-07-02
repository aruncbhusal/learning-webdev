import React, { useState } from "react";

/* In the very beginning we have a challenge, we need to get the value inside the two inputs and update the heading
The heading should include both first name and last name with hello.
My thought is that we can simply use two state variables for each and then use them both */

/*
function App() {
  // My initial solution:
  const [fName, setfName] = useState("");
  const [lName, setlName] = useState("");
  // Now we need two functions to get triggered on change of each input
  function handlefNameChange(event) {
    setfName(event.target.value);
  }
  function handlelNameChange(event) {
    setlName(event.target.value);
  }

  return (
    <div className="container">
      <h1>
        Hello {fName} {lName}
      </h1>
      <form>
        <input
          name="fName"
          placeholder="First Name"
          onChange={handlefNameChange}
          value={fName}
        />
        <input
          name="lName"
          placeholder="Last Name"
          onChange={handlelNameChange}
          value={lName}
        />
        <button>Submit</button>
      </form>
    </div>
  );
}
*/

/* But this code has so much going on, we have two hooks, two functions and so on for something that should be together
So we can instead consolidate them together using an object as a value instead of a primitive type */

function App() {
  const [fullName, setFullName] = useState({
    fName: "",
    lName: "",
  });
  // We can now change the rest of the code to work with these values
  // We have set the input to be a controlled component which means it will take only the value inside the object
  // So right now no matter what we type, since we don't update the object, nothing is shown in the input element
  // I can now use the handleChange function to detect the change and reflect it in the object

  function handleChange(event) {
    /*
    const currentValue = event.target.value;
    const currentInput = event.target.name;
    */
    // In fact, we can even replace this with the object destructuring syntax
    const { value: currentValue, name: currentInput } = event.target;

    // We can use the name attribute in the input element to know which one sent us the value
    // Now let's update the names using the useState callback
    /*
          if (currentInput === "fName") {
            setFullName({ fName: currentValue });
          } else if (currentInput === "lName") {
            setFullName({ lName: currentValue });
          }
    */
    // But there's a slight problem. Since we're passing an object, it replaces the object which was there previously
    // This means the new object only has one attribute, either the fName or lName so we can't display them both this way

    // But we can also supply a callback function to the setter function instead, which has the required logic
    // The reason for this is that when calling the callback, it passes the previous value of the state variable
    setFullName((prev) => {
      // Note: We should not try to use the event passed into the function inside this function
      // This is because when the event takes place, react passes a synthetic event object (wrapper on native html event)
      // Read more: https://legacy.reactjs.org/docs/events.html
      if (currentInput === "fName") {
        return { fName: currentValue, lName: prev.lName };
      } else if (currentInput === "lName") {
        return {
          fName: prev.fName,
          lName: currentValue,
        };
      }
    });
  }
  // In this way, we can use complex hooks to work with sophisticated state changes

  return (
    <div className="container">
      <h1>
        Hello {fullName.fName} {fullName.lName}
      </h1>
      <form>
        <input
          name="fName"
          placeholder="First Name"
          onChange={handleChange}
          value={fullName.fName}
        />
        <input
          name="lName"
          placeholder="Last Name"
          onChange={handleChange}
          value={fullName.lName}
        />
        <button>Submit</button>
      </form>
    </div>
  );
}

export default App;
