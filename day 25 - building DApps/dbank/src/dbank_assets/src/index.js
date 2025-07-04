/* Now we need to connect our Motoko backend with the frontend and we can do that with this JS
in order to be able to access the backend functions, we can use the dbank file in declarations folder
Inside the folder, the functions in our Motoko code are exposed. */
import { dbank } from "../../declarations/dbank";

window.dbank = dbank;
// Now we can add an event listener to update the current balance
window.addEventListener("load", async () => {
  const balance = await dbank.checkBalance();
  document.getElementById("value").innerText = balance.toFixed(2);
  // The challenge here was to only display 2 digits after the decimal, which we can do with toFixed
  // In the course, instead, Math.round(balance*100)/100 is used,
  // which is what I would have used if I didn't know toFixed existed
});

/* using a query normally doesn't seem to work nowadays  so we need to replace
const agent = new HttpAgent({ ...options?.agentOptions });
inside src/declarations/<canister_name>/index.js, to:
const agent = new HttpAgent({ 
  verifyQuerySignatures: false,
  ...options?.agentOptions 
});
We need to do this each time we deploy, sadly

Update: now we don't need it: look at the final comment to understand why */

// Now we also need to make the topUp and withdraw functions work. So we're going to work with the form element
document.querySelector('form').addEventListener('submit', async (event) => {
  // The default form behavior is to reset everything and refresh the page, but we don't want to refresh the page
  event.preventDefault();

  // Let's also disable the button when the transaction is being processed because it takes time, first select it
  const button = event.target.querySelector('#submit-btn');

  // Now we need to get the values inside the two input fields, but we need float values so we use
  const topupAmt = parseFloat(event.target.querySelector('#input-amount').value);
  const withdrawAmt = parseFloat(event.target.querySelector('#withdrawal-amount').value);

  // We need to disable it right before transactions start
  button.setAttribute("disabled", true);

  // We can't proceed with the transaction until a value is added to the input fields. So let's add condition
  if (event.target.querySelector('#input-amount').value.trim().length) {
    // If there is some value (I added a trim myself because there may be spaces) then we can proceed with the transaction
    console.log(topupAmt, typeof(topupAmt));
    await dbank.topUp(topupAmt);
    // This was giving me problems so I had to change the topUp function in the main.mo file to async (thanks GPT)
  }
  
  // A challenge was to implement withdraw as well. What if a person wants to both topup and withdraw. Let's allow
  if (event.target.querySelector('#withdrawal-amount').value.trim().length) {
    // We could also only allow one thing to happen, but then one would get priority over other. Let's do both
    console.log(withdrawAmt, typeof(withdrawAmt));
    await dbank.withdraw(withdrawAmt);
  }

  // Now we also need to make sure the money is compounded each time
  await dbank.compound();

  // Now we need to update the current balance to show the user the amount has been added
  const currentBalance = await dbank.checkBalance();
  document.getElementById('value').innerText = Math.round(currentBalance * 100) / 100;
  // This time I decided to use the alternative method

  // Finally now we can re enable the button
  button.removeAttribute("disabled");
})

// It wasn't working so I had to update the package.json from the solution. Took hours to reach the solution but it works now
/* Replace the dependencies with these working versions next time:
  "devDependencies": {
    "@dfinity/agent": "0.10.2",
    "@dfinity/candid": "0.10.2",
    "@dfinity/principal": "0.10.2",
    "assert": "2.0.0",
    "buffer": "6.0.3",
    "copy-webpack-plugin": "^9.0.1",
    "events": "3.3.0",
    "html-webpack-plugin": "5.5.0",
    "process": "0.11.10",
    "stream-browserify": "3.0.0",
    "terser-webpack-plugin": "5.2.5",
    "util": "0.12.4",
    "webpack": "5.63.0",
    "webpack-cli": "4.10.0",
    "webpack-dev-server": "^4.4.0"
     */