import React, { useState } from 'react';

/* This is basically the last lesson but with one extra step. Good thing that the hook is already set
I now need to simply make the inputs controlled elements, and use the values there to update the entire state */

function App() {
    const [contact, setContact] = useState({
        fName: '',
        lName: '',
        email: '',
    });

    // As always, let's start with a handleChange function
    /*
  function handleChange(event) {
    const { value, name } = event.target;
    setContact((prev) => {
      if (name === "fName") {
        return {
          fName: value,
          lName: prev.lName,
          email: prev.email,
        };
      } else if (name === "lName") {
        return {
          fName: prev.fName,
          lName: value,
          email: prev.email,
        };
      } else if (name === "email") {
      }
      return {
        fName: prev.fName,
        lName: prev.lName,
        email: value,
      };
    });
  }
  */

    // The above function is very long, even though it does what we want it to do
    // We can use the spread operator to make things easier for us
    // Instead of all the if statements, we can use a single spread operator to bring the previous object
    // Then we can change the key that corresponds to the name
    // The name of input is the same as the key of the object we need to replace, so we can use
    function handleChange(event) {
        const { value, name } = event.target;
        setContact((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
    // If we simply used name:value, it would assign the value to a new key called name
    // But in ES6 and Babel we can use this syntax to use a variable with the key name to be used as the key
    // It is actually similar to creating the object then using object[name]=value, but simplified syntax
    // https://stackoverflow.com/questions/11508463/javascript-set-object-key-by-variable?noredirect=1&lq=1

    // Now we also need to make these inputs controlled, so just change the value as per the state object
    return (
        <div className="container">
            <h1>
                Hello {contact.fName} {contact.lName}
            </h1>
            <p>{contact.email}</p>
            <form>
                <input
                    onChange={handleChange}
                    name="fName"
                    placeholder="First Name"
                    value={contact.fName}
                />
                <input
                    onChange={handleChange}
                    name="lName"
                    placeholder="Last Name"
                    value={contact.lName}
                />
                <input
                    onChange={handleChange}
                    name="email"
                    placeholder="Email"
                    value={contact.email}
                />
                <button>Submit</button>
            </form>
        </div>
    );
}
// Pretty simple really

export default App;
