import React, { useState } from "react";
import { canisterId, createActor } from "../../../declarations/token";
import { AuthClient } from "@dfinity/auth-client";

function Faucet() {
  // When the button is clicked, we want to disable the button so that it can't be clicked again
  const [isDisabled, setDisabled] = useState(false);
  // We also need a hook for the button text
  const [buttonText, setButtonText] = useState("Gimme gimme")

  async function handleClick(event) {
    setDisabled(true);

    // Similar to in the index.jsx we can identify the user using the auth module, along with creating actor to pass
    const authClient = AuthClient.create();
    const identity = await authClient.getIdentity();

    // Finally using this identity we create an authenticated canister to add the money to
    const authenticatedCanister = createActor(canisterId, {
      agentOptions: {
        identity,
      }
    })

    // Now we need to call the function that gives the user tokens
    // const payoutResult = await token.payOut();
    //We will call the payout method with the authenticated canister
    const payoutResult = await authenticatedCanister.payOut();
    setButtonText(payoutResult);
  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap emoji">
          🚰
        </span>
        Faucet
      </h2>
      <label>Get your free DAngela tokens here! Claim 10,000 KEKW tokens to your account.</label>
      <p className="trade-buttons">
        <button id="btn-payout" onClick={handleClick} disabled={isDisabled}>
          {buttonText}
        </button>
      </p>
    </div>
  );
}

export default Faucet;
