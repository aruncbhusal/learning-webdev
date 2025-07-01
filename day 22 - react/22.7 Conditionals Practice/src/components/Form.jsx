import React from "react";
import SubmitButton from "./SubmitButton";

/* This form looks pretty bloated with the inputs but even if I create a new one,
it will not have any visual difference so let me just keep it this way for now
I will need to use ternary operator to display login if true, and register if false
But maybe I should make the submit button a new compoennt instead */

function Form(props) {
  return (
    <form className="form">
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      {/* {props.registered ? (
        <SubmitButton text="Login" />
      ) : (
        <div>
          <input type="password" placeholder="Confirm Password" />
          <SubmitButton text="Register" />
        </div>
      )} */}
      {/* I wanted to do it all in one comparison, but after watching like 30 seconds,
      I think I have a better idea, why not have two comparisons and put it that way
      I will first render the confirm password only if it is false
      Then I will render the button according to the boolean value
      I can use && operator for confirm password and ternary for button
      I'm leaning towards this solution because I don't want to create a new div
      Sometimes a level of nesting can mess up the styling, even though not this time */}
      {!props.registered && (
        <input type="password" placeholder="Confirm Password" />
      )}
      <SubmitButton text={props.registered ? "Login" : "Register"} />
      {/* Works like a charm! But we didn't really need the SubmitButton component here
      That feels like a bit of overengineering. But whatever, works. */}
    </form>
  );
}

export default Form;
