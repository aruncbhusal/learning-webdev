import React from "react";
import Input from "./Input";

function LoginForm(props) {
  return (
    <form className="form">
      <Input type="text" placeholder="Username" />
      <Input type="password" placeholder="Password" />
      <button type="submit">{props.submit}</button>
    </form>
  );
}

export default LoginForm;
