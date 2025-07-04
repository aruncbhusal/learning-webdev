/* The project we're going to build is a Decentralized Bank, where people can lend and borrow money at certain interest
But first, we need to get familiar with the programming language Motoko.
The project is inspired by Compound: https://app.compound.finance/?market=usdc-mainnet
*/
import Debug "mo:base/Debug";
// In order to use the logging and debugging functionality, we need to import the debug object
import Time "mo:base/Time";
// To work with floating point values we need to get float as well
import Float "mo:base/Float";

actor Dbank {
  // An actor is similar to a class, and each actor is stored in a canister
  stable var currentValue : Float = 100;
  // We can also use var currentValue: Nat = 250; but normally it is implicitly understood
  // Initiating a variable is simple, we use var keyword
  // Orthogonal Persistence is the ability to retain the state even after changes have been made and deployed
  // For a normal (flexible) variable, the state is reset each time we re-deploy, but if we add a 'stable' keyword
  // It becomes a persistent variable, and we can change other code wihout affecting it

  // currentValue := 100;
  // To reassign a variable, we use a colon followed by an equal sign
  // Since we're using a persistent variable, using the reassignment line would reset the value to this value, so we don't use it
  // The stable variable initialization does not reset the value that already persists

  let id = 9876578;
  // The let keyword is used to create a constant that cannot be reassigned

  Debug.print("hello");
  Debug.print(debug_show (currentValue));
  // The print function expects a string value, but we can use debug_show to show NaT (Natural Number)
  // The task was to print out the id similarly
  Debug.print(debug_show (id));
  // It printed out 9_876_578, seems to add _ as delimiter

  // To implement the most importatnt part of money i.e. compounding, we can use the formula A=P(1+r/n)^nt
  // We have a now() function in motoko, it gives us the UNIX time in nanoseconds. Let's try to get the current time first
  stable var startTime = Time.now();
  Debug.print(debug_show (startTime));

  // startTime := Time.now();

  // Now we want to add functionality to our app. We can create a function to topup someone's wallet:
  public func topUp(amount : Float) {
    // We can add parameters by using parameter name along with the data type, this time Nat
    currentValue += amount;
    Debug.print(debug_show (currentValue));
  };
  // Every function too ends with a semi colon here
  // topUp();
  // The funtion can be called inside the canister, but also outside the canister, by adding a public modifier to it
  // In order to call a function from the outside, we need to use 'dfx canister call <canister_name> <fn_name> "(<parameters>)" '
  // After we make changes to our code, we need to redeploy
  // Calling from the console is fine, but we can also call it using an interactive interface called Candid UI
  // To initiate the candid UI, we can use 'dfx canister id __Candid_UI'
  // Then we can copy the ID and go to '127.0.0.1:8000?canisterId=<That_ID>' where we need to insert the app canister id
  // We can find it by using 'dfx canister id dbank' and paste it in the box, which will open the interactive interface
  // We can then call the function by using the call button in that page
  // After adding the parameter, we need to enter the parameter amount and call the function
  // The variables values reset each time we deploy because of orthogonal persistence

  // Now a challenge was to create a new function to withdraw money from the account
  public func withdraw(amount : Float) {
    let newValue : Float = currentValue - amount;
    if (newValue > 0) {
      // Since it doesn't know the data type of the value to be compared, we need to explicitly tell it by using a variable
      currentValue -= amount;
      Debug.print(debug_show (currentValue));
    } else {
      Debug.print("Insufficient balance for the withdraw");
    };
    // The conditional statements are similar to JS
  };
  // When simply subtracting the amount from current value, we can end up with a subtraction underflow (natural numbers are +ve)

  // These functions take a very long time to complete execution when called, it is because they are 'Update Methods'
  // They need to add to the blockchain which is computationally expensive, and require to pass the consensus
  // But we can also instead use a 'Query Method' using the query keyword in the function definition to simply read the value
  public query func checkBalance() : async Float {
    // We need to add async to a query method because that allows the queries to happen independently without blocking others
    // In the interface the button to run it is called "query" rather than call
    return currentValue;
  };

  // Now we need to add the compounding functionality. For that we can create a new function
  public func compound() {
    // Let's assume the rate is 1%, then we can simply get the current time and new currentValue
    let currentTime = Time.now();
    let timeElapsed = (currentTime - startTime) / 1000000000;
    // Now that we know the seconds passed, we can use it with the compounding equation
    currentValue := currentValue * (1.01 ** Float.fromInt(timeElapsed));
    // We don't have a clear cut way to convert Nat to float, and value must be float, so we use that, and update above as well
    startTime := currentTime;
  };
};

// To run the code, use 'dfx start' in this folder in the terminal
// Then open a new terminal and use 'dfx deploy' and then 'npm start' (npm not necessary for debug, but for frontend)
// The 'dfx new ..' command installs webpack-cli 4.9.1, but we need at least 4.10.0 for our code to run
// So change the version, run 'npm install', then run 'npm start'

// After the backend is done, we now need to have a frontend for the users. We can put the html, css and js in dbank_assets
// The html and css are given in the course, I simply need to copy paste and replace the values and use 'npm start' to run
// There is a spot for logo, for which we can use Namecheap to get an AI Generated Logo
