import React from "react";
import DescriptionIcon from "@material-ui/icons/Description";

function Header() {
  return (
    <header>
      <h1>
        <DescriptionIcon />
        Keeper
      </h1>
    </header>
  );
}

// The final thing to change is adding a logo for the keeper app, let me use a pencil of sort
// Settled for a description icon

export default Header;
