import Principal "mo:base/Principal";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";

/* The starting code has the barebones setup for React as well as top level components set up
The project was inspired by Curve https://curve.fi/ so the UI resembles it
We need to be able to create and distribute tokens from the interface, let's design the set up now */
actor Token {
    // In order to store uniquely identify canisters/users, we must use a type of Principal
    let owner : Principal = Principal.fromText("qv4tz-6oeig-rym4f-f6wr3-xbi3z-3c2yu-mz5ew-fyhjn-vpxiy-rpre3-sqe");
    // The fromText method can convert the string we get from using `dfx identity get-principal` into a type principal
    let totalSupply : Nat = 1000000000;
    let symbol : Text = "KEKW";
    // These variables store the total supply of the token and the symbol to identify it as.

    // Our balances hashmap will get reset each time we redeploy, but HashMap isn't a stable type, so we need to use an array
    // The array will store all the balances before upgrade, then update the hashmap after the upgrade to previous state
    private stable var balanceEntries : [(Principal, Nat)] = [];
    // We need to store a tuple containing the values in the hashmap, but since this is a sequential type, we don't use it in place of HashMap

    // In order to store the balance of a Principal(user) with the number of tokens they have, we can use a HashMap type
    private var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
    // We create a hashmap where key is type principal value type Nat, three args: initial no. of items, comparator, hashing method
    // balances.put(owner, totalSupply);
    // We don't want to give the owner all the supply every time we deploy the canister, we want it to happen only under certain case
    if (balances.size() < 1) {
        balances.put(owner, totalSupply);
    };
    // This line puts a key value pair into the balances HashMap, and overrides if the key already exists.

    // Now we need a function to check the current balance for a user. We can create a query function
    public query func balanceOf(who : Principal) : async Nat {
        // We use the get method to get the value for a key. If the key doesn't exist it returns null, else it returns Nat
        // In order to handle this difference in data type, we need to use optionals, for that we use switch statement
        let balance : Nat = switch (balances.get(who)) {
            case null 0;
            case (?result) result;
        };
        // If result is of any other type than null, it returns the result, which is a Nat. Now we can return balance
        return balance;
        // In order to test our code, we need to store our(owner) Principal as a env variable and use it
        // The instructions are in the README.md (given in starting code)
    };

    // Now a function to return the token symbol
    public query func getSymbol() : async Text {
        return symbol;
    };

    // Next, a function that enables a user to get some tokens from the faucet
    // We need to use a shared type function which sends a msg argument whose caller property has the principal of caller
    public shared (msg) func payOut() : async Text {
        // We want to only give the user free tokens if they have not yet claimed any. So we must check if user is in hashmap
        Debug.print(debug_show (msg.caller));
        if (balances.get(msg.caller) == null) {
            // We add an entry for the caller with 10k tokens
            let amount = 10000;
            // balances.put(msg.caller, amount);
            // This line has a problem, beacuse when we transfer the tokens, it has to come from somewhere
            // In this case we want to give the tokens from the agent canister itself so this should be a transfer function
            let result = await transfer(msg.caller, amount);
            // Now since we already get a Success from the transfer function if it went through, we can use its result here
            // But to send from the canister, the canister needs to have soemthing. To fix that we'll follow README.md
            return result;
        } else {
            return "Already Claimed!";
        }
        // Now we can use the returned value to replace the button to claim
        // Testing within the console will use the principal of owner, but using on frontend will use a different principal
    };

    // What if we call a shared function from another function? The msg.caller will be the canister id itself

    // Our next task is to add the transfer functionality, it takes a recipient ID and amount
    public shared (msg) func transfer(to : Principal, amt : Nat) : async Text {
        // We will only send if the funds are sufficient
        let balanceSender = await balanceOf(msg.caller);
        if (balanceSender >= amt) {
            // Now we subtract from the sender and give to recipient
            let newBalanceSender = balanceSender - amt;
            balances.put(msg.caller, newBalanceSender);

            // Since the put method will create a new entry if it doesn't exist, we don't have to deal with any problems
            let balanceRecipient = await balanceOf(to);
            let newBalanceRecipient = balanceRecipient + amt;
            balances.put(to, newBalanceRecipient);

            return "Success";
        } else {
            return "Insufficient funds";
        };
        // Now we can implement this on the frontend
    };

    // In order to make the stable array store the balances, we need to reply on the Iter module which can handle conversions
    system func preupgrade() {
        // This will run before the canister is upgraded
        balanceEntries := Iter.toArray(balances.entries());
        // The balances hashmap is not iterable by default, but entries method turns it into iterable
    };

    system func postupgrade() {
        // After the upgrade we need to set the balances hashmap back from the balanceEntries array
        balances := HashMap.fromArray<Principal, Nat>(balanceEntries.vals(), 1, Principal.equal, Principal.hash);
        // We can also include the code to add supply to the owner but it already runs being in the global scope.
    };
};

/* We can also add authentication using Internet Identity, where the user creates an identity without storing anything,
they use their biometrics to create a private and a public key, the public key is stored on the server, and private is generated
by the user's biometrics or other cryptographically secure methods of identification.
Both the private and public keys are needed to access the service, which ensures high security, rather than relying on passwords. */
