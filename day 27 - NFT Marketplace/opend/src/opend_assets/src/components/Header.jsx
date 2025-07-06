import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import { BrowserRouter, Link, Switch, Route } from "react-router-dom";
import Minter from "./Minter";
import Gallery from "./Gallery";
import homeImage from "../../assets/home-img.png";
import { opend } from "../../../declarations/opend/index";
import CURRENT_USER_ID from "../index";


function Header() {
  // Now we need to get all the nfts and send the principals to the gallery component
  // So let's create a new state for Gallery so that we can render all
  const [userGallery, setUserGallery] = useState();
  // We need to create another gallery for the discover page
  const [listGallery, setListGallery] = useState();

  // Now we need to get all the NFTs for the user then send it to the gallery with a function
  async function getNFTs() {
    const allNFTIds = await opend.getOwnedNFTs(CURRENT_USER_ID);
    // This current user id was exported in the index.js to make things easier
    setUserGallery(<Gallery title="My NFTs" ids={allNFTIds} mode="collection" />);
    // We will send all NFT IDs to the gallery component

    const listedNFTIds = await opend.getListedNFTs();
    // We also need to get all the listed NFTs and set the list gallery
    // We also need to send the mode so that we know what type of gallery we are in
    setListGallery(<Gallery title="Discover" ids={listedNFTIds} mode="discover" />)
  }

  // Now we need to run the getNFT function each time we refresh so we'll use useEffect hook
  useEffect(() => {
    getNFTs();
  }, [])
  // But this only takes place when the page refreshes, React router doesn't refresh the page by default
  // We need to force the refresh on a route

  // To add routing ability to our app, we need to import the react router and use it
  return (
    <BrowserRouter forceRefresh={true} >
      {/* We need to create links for each of buttons we have as well as the homepage i.e. h5 */}
      <div className="app-root-1">
        <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
          <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
            <div className="header-left-4"></div>
            <img className="header-logo-11" src={logo} />
            <div className="header-vertical-9"></div>
            <Link to="/">
              <h5 className="Typography-root header-logo-text">OpenD</h5>
            </Link>
            <div className="header-empty-6"></div>
            <div className="header-space-8"></div>
            <Link to="/discover">
              <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
                Discover
              </button>
            </Link>
            <Link to="/mint">
              <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
                Minter
              </button>
            </Link>
            <Link to="/gallery">
              <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
                My NFTs
              </button>
            </Link>
          </div>
        </header>
      </div>
      {/* We also need to be able to switch between the links as per the URL */}
      <Switch>
        <Route exact path="/">
          {/* We had to add the exact keyword because else all paths would be routed here since they start with '/' */}
          <img className="bottom-space" src={homeImage} />
        </Route>
        <Route path="/discover">
          {/* This page has the marketplace, will be updated once the part is done */}
          {listGallery}
        </Route>
        <Route path="/mint">
          <Minter />
        </Route>
        <Route path="/gallery">
          {userGallery}
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Header;
