import ReactDOM from 'react-dom'
import React from 'react'
import App from "./components/App";
import { AuthClient } from "@dfinity/auth-client"

const init = async () => {
  // We can use the auth client module to authenticate the user
  // First we need to create the client
  const authClient = await AuthClient.create();

  // Then we will check if the user is already authenticated, if yes we want to handle that case
  if (authClient.isAuthenticated()) {
    await handleAuthenticated();
  }

  // If not, we want to let the user authenticate using the Internet Identity token
  await authClient.login({
    identityProvider: "https://identity.ic0.app/#authorize",
    onSuccess: () => {
      handleAuthenticated();
    }
  })

}

async function handleAuthenticated() {
  ReactDOM.render(<App />, document.getElementById("root"));
}

init();


