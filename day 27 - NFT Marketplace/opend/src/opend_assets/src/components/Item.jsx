import React, {useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { idlFactory as tokenIdlFactory} from "../../../declarations/token";
import { idlFactory } from "../../../declarations/nft";
import Button from "./Button";
import { opend } from "../../../declarations/opend";
import PriceLabel from "./PriceLabel";
import CURRENT_USER_ID from "../index";

function Item(props) {
  // Let's create the useState hooks for the nft properties
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [blur, setBlur] = useState();
  const [listStatus, setListStatus] = useState(false);
  const [priceLabel, setPriceLabel] = useState();
  const [toDisplay, setDisplay] = useState(true);

  // Inside this component, we need to receive the canister id then use it to make a request to the backend
  const id = props.canisterID;

  // We will need to make HTTP Request, so let's get the packages
  // Since we need to make a call, we will need to set the location, which is our localhost
  const localHost = "http://localhost:8080";
  const agent = new HttpAgent({ host: localHost });
  // In order to be able to work locally instead of needing the ICP canister ID, we need to use:
  agent.fetchRootKey();

  let NFTActor;
  // We need to access the actor in other functions as well
  // Now we need a function that will load the nft
  async function loadNFT() {
    // We also need the idlFactory, which is an interface description language that describes the interfaces we have
    // These interfaces connect the functions we have on the backend to our frontend code
    NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });

    // Now that we have the actor, we can use it to get the name and other properties
    const nftName = await NFTActor.getName();
    // In order to set the properties, we will need to use a useState hook.
    setName(nftName);
    // A challenge here was to also get the owner
    const nftOwner = await NFTActor.getOwner();
    setOwner(nftOwner.toText());

    // Now in order to also set the image, we need to do some more work
    const imageData = await NFTActor.getAsset();
    // We can't simply use this image, we need to convert this into a JS Supported data type
    const imageArray = new Uint8Array(imageData);
    // Finally to display this image into the frontend we need to create a URL
    const image = URL.createObjectURL(new Blob([imageArray.buffer], { type: "image/png" }));
    // We need to create an array buffer: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
    // https://developer.mozilla.org/en-US/docs/Web/API/Blob/arrayBuffer
    setImage(image);

    // We only check for listed of not if we're on the collection mode, not in discover
    if (props.mode == "collection") {
      // While loading, we can also check if the nft is listed on the marketplace
      const isListed = await opend.isListed(id);
      if (isListed) {
        setOwner("OpenD");
        setBlur({ filter: "blur(4px)" });
        setListStatus(true);
      } else {
        // When loading the NFT we also need to load the button to handle the sell operation
        setButton(<Button action={handleSell} text="Sell" />)
        // We only show the button if the NFT is not listed
      }
    } else if (props.mode == "discover") {
    // We need to know who listed the NFT for sale (original owner so let's make a call to the backend)
    const originalOwner = await opend.getOriginalOwner(id);
    // We want to only display buy button if it is not the current user
    if (originalOwner.toText() != CURRENT_USER_ID.toText()){
      setButton(<Button action={handleBuy} text="Buy" />)
    }

    // If we're on the discover page, we also need to get the price from the backend and update it
    const itemPrice = await opend.getListedPrice(id);
    setPriceLabel(<PriceLabel price={Number(itemPrice)} />);
  }
}

  // Now we need to update the frontend after receiving the attributes, so we need to use the useEffect hook
  useEffect(() => {
    loadNFT();
  }, []);
  // We need to update the frontend so the nft is displayed

  let price;
  function handleSell() {
    // When the sell button is clicked, we need to add a new input field, the html is available in the readme as well
    // Let's create a new state for that input field as well
    setPriceInput((
      <input
        placeholder="Price in KEKW"
        type="number"
        className="price-input"
        value={price}
        onChange={(e) => price = e.target.value}
      />
    ));
    // This way we create a controlled React element which keeps track of its own state at all time
    // We're not using state here because async calls aren't certain to change the value instantly when user changes it
    // Since we have a lot of async calls going on.

    // Once the input field is shown, we now need the button to change its behavior, not its job will be to actually list the nft
    setButton(<Button action={sellItem} text="Confirm" />);
  }

  // Now we need to handle the actual sale
  async function sellItem() {
    // We set the loader and blur the image
    setLoaderHidden(false);
    setBlur({ filter: "blur(4px)" })
    // First let's import the canister interface to be able to call the listing function
    const listResult = await opend.listItem(props.canisterID, Number(price));
    // Since the input field stores value as a string, we need to change it to number
    console.log(listResult);
    // Now we need to transfer the nft to the system if the listing was a success
    if (listResult == "Success") {
      const openDID = await opend.getOpenDCanisterID();
      const transferResult = await NFTActor.transferOwnership(openDID);
      console.log(transferResult);
      // Now if the transfer was a success, we want to hide the sell button, update the owner and hide loader
      if (transferResult == "Success") {
        setLoaderHidden(true);
        setButton();
        setPriceInput();
        setOwner("OpenD");
        setListStatus(true);
      }
    }
  }

  // We need to handle the buy button as well now
  async function handleBuy() {
    // console.log("Buy pressed");
    setLoaderHidden(false);
    // Now we need to handle this, let's create the actor from the idlFactory
    const tokenActor = await Actor.createActor(tokenIdlFactory, {
      agent,
      canisterId: Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai")
      // TODO: Replace this when testing with the one received from the token project
    });

    // Next let's get the details about the listing
    const sellerId = await opend.getOriginalOwner(props.canisterID);
    const itemPrice = await opend.getListedPrice(props.canisterID);

    // Let's first transfer the tokens from the current user to the seller using the token actor method
    const result = await tokenActor.transfer(sellerId, itemPrice);
    if (result == "Success"){
      // Final part, the actual transaction
      const transferResult = await opend.purchase(props.id, sellerId, CURRENT_USER_ID);
      console.log(transferResult);
      setLoaderHidden(true);
      // We also need to stop displaying the NFT in the marketplace after the transaction is complete
      // Let's create a state and add a new display attribute to the div
      setDisplay(false);
    }
  }


  return (
    <div display={toDisplay? "inline": "none"} className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div className="lds-ellipsis" hidden={loaderHidden}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name} <span className="purple-text">{listStatus && "Listed"}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
