import React, { useState } from "react";

function App() {
  /* We have already seen how we can use attributes like onClick to specify an event and trigger a change in state
  First let's implement a change in the heading, which is simply "Hello". What if I changed it to something else on click? */
  const [headingText, setHeadingText] = useState("Hello");

  // function handleClick() {
  // setHeadingText("Clicked Submit");
  // }

  /* But onClick isn't the only event handling HTML attribute we have. The list of event attributes can be found at
  https://www.w3schools.com/tags/ref_eventattributes.asp
  In our interest, we have two attributes called onmouseover and onmouseout, which are basically hover on and dis-hover(??)
  Our challenge is to set the backgorund color of the button to back when hovered, but white when not */

  const [btnBgColor, setBtnBgColor] = useState("white");

  function handleHover() {
    setBtnBgColor("black");
  }

  function handleOut() {
    setBtnBgColor("white");
  }

  /* Took me a while to realize I could use variables inside style as well */

  /* Now what if I wanted to handle the form i.e. the input field too?
  We can add a onChange event attribute by creating a changeHandler function
  Inside the function, a parameter is passed, which describes the event.
  We can use event.target to select the event on which the event occured, and its attributes as well
  Let's create a handler that logs out any change in the input value */

  /* In React, the state of something like input, textarea or others (mutable elements) is handled explicitly
  i.e. we specify the variable value ourself using hook to store the variable value. This is called controlled components.
  For this we can create a new useState hook for the value of the input
  https://legacy.reactjs.org/docs/forms.html#controlled-components */
  const [name, setName] = useState();

  function changeHandler(event) {
    console.log(event.target.value);
    setName(event.target.value);
    // Now that name as a state has the value inside the input element, we can use it as a value attribute for it
  }

  /* A challenge at this point is that on click we need to update the heading text to say Hello {name}
  I had a click handler before so I need to comment it out before I give this one a shot */
  function handleClick() {
    setHeadingText(name);
    // Initially I had the entire heading as the state variable, but then I figured Hello is static anyway
    // Plus this was the method used in the course and felt more natural
  }

  /* Currently our input and button are just there, but normally we may find them inside a form element
  And when we press on a button, or an input with type=submit, it triggers an event onsubmit in the form
  We can handle the submit behavior there as well. Let's create a new button and have it as a part of this form */
  function handleSubmit(event) {
    /* The default behavior of a form is to reload the page after making a post request, but we may not want that
    If we update something in the page on submit, it is reset after the refresh. Let's update the background color
    of the submit button below to green when submit form is pressed i.e. form is submitted */
    setBtnBgColor("#33ff33");
    // But since the page refreshes right after, the state is lost. In order to prevent this
    event.preventDefault();
    // This prevents the default behavior of the form from happening if we don't intend to
  }

  return (
    <div className="container">
      <h1>Hello {headingText}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="What's your name?"
          onChange={changeHandler}
          value={name}
        />
        <button type="submit">Submit Form</button>
      </form>
      <button
        onClick={handleClick}
        style={{ backgroundColor: btnBgColor }}
        onMouseOver={handleHover}
        onMouseOut={handleOut}
      >
        Submit
      </button>
    </div>
  );
}
/* The difference between the course solution and mine is that I set the state of the background color itself on mouse hover
But she instead sets a boolean to true or false depending on whether it is hovered. Then using a ternary operator,
the style is set as backgroundColor: isHovered ? "black" : "white" */

export default App;
