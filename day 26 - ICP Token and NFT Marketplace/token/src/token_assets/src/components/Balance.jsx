import React, { useState } from "react";
import { Principal } from "@dfinity/principal";
import { token } from "../../../declarations/token"

function Balance() {
  // We need to update this method so that when the Check Balance button is clicked the balance of the principal id is shown
  // We will need to bring in the useState hook first to make the input field a controlled variable that holds the text
  const [inputValue, setValue] = useState("");
  // Similarly, we also need to use a hook for the returned balance value
  const [balanceString, setBalance] = useState("");
  const [isHidden, setHidden] = useState(true);

  async function handleClick() {
    // console.log("Balance Button Clicked");
    // Inside this function, we need to make a call to the backend, but we also need to send a Principal data type
    // So we need to import both the principal data type as well as the actor from the backend
    const balance = await token.balanceOf(Principal.fromText(inputValue));
    // A challenge was to also get the symbol of the currency using a new getSymbol query function
    const symbol = await token.getSymbol();
    setBalance(balance.toLocaleString() + ` ${symbol}`);
    // We get the balance from the backend and convert it to a stirng then update the balance field
    // In her solution she created a new hook for that, but I don't see the point

    // Now we also want to hide the paragraph until the balance is retrieved so we can use a hidden boolean
    setHidden(false);
  }


  return (
    <div className="window white">
      <label>Check account token balance:</label>
      <p>
        <input
          id="balance-principal-id"
          type="text"
          placeholder="Enter a Principal ID"
          value={inputValue}
          onChange={(e) => setValue(e.target.value)}
        />
      </p>
      <p className="trade-buttons">
        <button
          id="btn-request-balance"
          onClick={handleClick}
        >
          Check Balance
        </button>
      </p>
      <p hidden={isHidden}>This account has a balance of {balanceString}.</p>
    </div>
  );
}

export default Balance;
