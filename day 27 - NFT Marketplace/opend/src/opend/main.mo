import Debug "mo:base/Debug";
import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import NFTActorClass "../nft/nft";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Iter "mo:base/Iter";

actor OpenD {

    // We need to store all the listings in the marketplace. Each listing has different attributes
    // We can create a new private data type to store each listing
    private type Listing = {
        itemOwner : Principal;
        itemPrice : Nat;
    };

    // We need a way to store all the NFTs, we can use HashMap
    var nftMap = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
    // We also need a hashmap to store all NFTs of an individual user
    // Since a user can have multiple nfts, unlike nfts having a single principal id, we will need to use a list
    var ownerMap = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
    // Since we've got a listing type, we now need to store all the listings in a HashMap
    var listingMap = HashMap.HashMap<Principal, Listing>(1, Principal.equal, Principal.hash);

    // We need to add a new function that allows minting
    public shared (msg) func mint(imgData : [Nat8], name : Text) : async Principal {
        // We take input from the frontend then we return a Principal(of the canister created)
        // The owner will be the Principal of the caller
        let owner : Principal = msg.caller;

        // Since creating a new canister requires cycles, let's take some
        Debug.print(debug_show (Cycles.balance()));
        Cycles.add(100_500_000_000);
        // We're taking 100.5B cycles for the creation of the NFT

        // Now we create the NFT by interfacing with the actor class
        let newNFT = await NFTActorClass.NFT(name, owner, imgData);

        // Let's again display the balance afterwards
        Debug.print(debug_show (Cycles.balance()));

        // Since we need to return the principal, let's get it from the newly created NFT
        let newNFTPrincipal = await newNFT.getCanisterId();

        // We now need to add the new NFT into the NFT's hashmap
        nftMap.put(newNFTPrincipal, newNFT);
        // But to add the NFT into the user's hashmap, we have to do more, let's create a new function
        addToOwnerMap(owner, newNFTPrincipal);

        return newNFTPrincipal;
    };

    private func addToOwnerMap(owner : Principal, nftId : Principal) {
        // We need to get the list of currently owned NFTs then add to that list and reassign to user's key
        // But the get method may return either a null(if the owner doesn't exist) or an option variable, we need switch
        var currentlyOwned : List.List<Principal> = switch (ownerMap.get(owner)) {
            case null List.nil<Principal>();
            case (?result) result;
        };
        // Now we can add to this list
        currentlyOwned := List.push(nftId, currentlyOwned);

        // Finally we add this list to the owner hashmap
        ownerMap.put(owner, currentlyOwned);
    };

    // At this point, for the gallery we need to get all the nfts owned by a user. We need a query function
    public query func getOwnedNFTs(user : Principal) : async [Principal] {
        // This was left as a challenge, but is very similar to the function above, where we have to get from the map
        var currentlyOwned : List.List<Principal> = switch (ownerMap.get(user)) {
            case null List.nil<Principal>();
            case (?result) result;
        };
        return List.toArray(currentlyOwned);
        // We need to convert the motoko list into a JS array to send to the frontend
    };

        // We now need a function to return all the currently listed NFTs
    public query func getListedNFTs(): async [Principal] {
        // We need to get all the keys of the listingMap hashmap
        return Iter.toArray(listingMap.keys());
        // We need to convert the keys list into an array, using toArray
    };


    // Now that we have listings recorded, we also need a function to add items to the listing
    // The owner of a NFT will call this shared function to list their NFT on the marketplace
    public shared (msg) func listItem(id : Principal, price : Nat) : async Text {
        // First, let's get the actual nft from the principal, since we need to change owner of the NFT to the system
        var item : NFTActorClass.NFT = switch (nftMap.get(id)) {
            case null return "NFT does not exist";
            case (?result) result;
        };

        // Now that we have the nft, we need to ensure the owner is the one trying to sell the nft
        let owner = await item.getOwner();
        if (Principal.equal(owner, msg.caller)) {
            // If this is true, we can list the NFT
            let newListing : Listing = {
                itemOwner = owner;
                itemPrice = price;
            };
            // Now we can put it int he listing map
            listingMap.put(id, newListing);
            return "Success";
        } else {
            return "You do not own the NFT";
        };
    };

    // To transfer the ownership to system's canister ID, we need to be able to query that from the frontend
    public query func getOpenDCanisterID() : async Principal {
        return Principal.fromActor(OpenD);
        // We can also instead use this binding to use this here.
    };

    // In order to know if an item is listed, we can create a new query function
    public query func isListed(id : Principal) : async Bool {
        if (listingMap.get(id) == null) {
            return false;
        } else {
            return true;
        };
    };

    // To return the original owner, we need yet another query function that returns the owner from the listing item
    public query func getOriginalOwner(id: Principal) : async Principal {
        // Let's get the listing first
        let listing : Listing = switch(listingMap.get(id)) {
            case null return Principal.fromText("");
            case (?result) result;
        };
        return listing.itemOwner;
    };
    
    // Siimlarly for the price, I will just copy paste and change
    public query func getListedPrice(id: Principal) : async Nat {
        // Let's get the listing first
        let listing : Listing = switch(listingMap.get(id)) {
            case null return 0;
            case (?result) result;
        };
        return listing.itemPrice;
    };

    // Now the next part of the project deals with the token project as well, for which we need to deploy it alongside
    // So to test it, we need to follow the last step in the README, and replace the owner id with the principal id there
    // Let's deal with the final function for buying the nft from the marketplace
    public shared(msg) func purchase(id: Principal, ownerId: Principal, newOwnerId: Principal): async Text {
        // Let's first get the NFT to be purchased
        var purchasedNFT : NFTActorClass.NFT = switch (nftMap.get(id)) {
            case null return "NFT does not exist";
            case (?result) result;
        };

        // First transfer the NFT from buyer to seller
        let transferResult = await purchasedNFT.transferOwnership(newOwnerId);
        if (transferResult == "Success") {
            // In this case we can proceed with the transaction and delete the listing
            listingMap.delete(id);
            // Now we get the list of NFTs owned by the seller from the ownerMap
            var sellerOwnedNFTs : List.List<Principal> = switch(ownerMap.get(ownerId)) {
                case null List.nil<Principal>();
                case (?result) result;
            };
            // To remove the nft from the seller's list of owned nfts, we can use the filter method
            sellerOwnedNFTs := List.filter(sellerOwnedNFTs, func (listItemId: Principal): Bool {
                return listItemId != id;
            });
            // This method takes a list and a callback. The callback has a parameter of each element of the list
            // When the function returns true, that item is kept, if false, it is discarded

            // We need to now add the NFT to the new owner's list
            addToOwnerMap(newOwnerId, id);
            return "Success";
        } else {
            return "Error!";
        }
    }

};
