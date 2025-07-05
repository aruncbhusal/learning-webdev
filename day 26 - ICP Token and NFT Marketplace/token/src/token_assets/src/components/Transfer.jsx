import React, { useState } from "react";
import { canisterId, createActor } from "../../../declarations/token";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";

function Transfer() {
  // First we need to create hooks to create the input fields into controllable React components
  const [recipientID, setID] = useState("");
  const [amount, setAmount] = useState(0);
  const [isDisabled, setDisabled] = useState(false);
  const [remarks, setRemarks] = useState("");

  async function handleClick() {
    // Now we need to handle the transfer here. First we need to convert the received values to desired types
    // Let's disable the button when pressed until transaction complete
    setDisabled(true);
    // We should also clear the remarks or hide it
    setRemarks("");
    const to = Principal.fromText(recipientID);
    const amt = Number(amount);

    // Just like in the faucet, we need to get the authenticated canister here as well
    const authClient = AuthClient.create();
    const identity = await authClient.getIdentity();

    const authenticatedCanister = createActor(canisterId, {
      agentOptions: {
        identity,
      }
    })

    const transferResult = await authenticatedCanister.transfer(to, amt);
    // Now we use the result of this function to update the remarks/feedback
    setRemarks(transferResult);
    setDisabled(false);
  }

  return (
    <div className="window white">
      <div className="transfer">
        <fieldset>
          <legend>To Account:</legend>
          <ul>
            <li>
              <input
                type="text"
                id="transfer-to-id"
                value={recipientID}
                onChange={(e) => setID(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Amount:</legend>
          <ul>
            <li>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}

              />
            </li>
          </ul>
        </fieldset>
        <p className="trade-buttons">
          <button id="btn-transfer" onClick={handleClick} disabled={isDisabled} >
            Transfer
          </button>
        </p>
        <p>{remarks}</p>
      </div>
    </div>
  );
}

export default Transfer;
