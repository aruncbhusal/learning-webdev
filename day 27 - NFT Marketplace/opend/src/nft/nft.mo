/* Since we need all nfts to be unique, we need to create them as actor classes, those with their own attributes
The attibutes will be nft name, its creator (principal of creator) and the image */
import Principal "mo:base/Principal";

actor class NFT(name : Text, owner : Principal, image : [Nat8]) = this {
    // The image is an array of 8 bit natural numbers
    // We're binding this NFT class to a this variable

    // Now we need to define the attributes
    private var itemName = name;
    private var nftOwner = owner;
    private var imageBytes = image;

    // Now we need query functions to get these data
    public query func getName() : async Text {
        return itemName;
    };

    public query func getOwner() : async Principal {
        return nftOwner;
    };

    public query func getAsset() : async [Nat8] {
        return imageBytes;
    };
    // After creating this new folder and new file we need to add it as a canister in dfx.json
    // While deploying, we need to pass the nft attributes as an argument, the script line is given in Readme

    // After the NFT has been minted, we will need to send its principal back, so let's have another function
    public query func getCanisterId() : async Principal {
        return Principal.fromActor(this);
    };

    // When we list an NFT on the marketplace, we're transferring the token to the system. We need to have a transfer function
    public shared (msg) func transferOwnership(to : Principal) : async Text {
        if (Principal.equal(msg.caller, nftOwner)) {
            nftOwner := to;
            return "Success";
        } else {
            return "Error: Not initiated by NFT Owner";
        };
    };
};
