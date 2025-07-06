import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import Item from "./Item";
import Minter from "./Minter";

function App() {
  // In order to show our nft, we need to replace the img element with an item component
  // We also need to pass it the id of the nft canister we created
  // We can get the id using `dfx canister id nft`

  // In the initial page we're now displaying the minter insted

  // We're going to be using React router in the header component so we don't need to render anything but header and footer here
  // const canisterID = "rrkah-fqaaa-aaaaa-aaaaq-cai";
  return (
    <div className="App">
      <Header />
      {/* <Minter /> */}
      {/* <Item canisterID={canisterID} /> */}
      {/* <img className="bottom-space" src={homeImage} /> */}
      <Footer />
    </div>
  );
}

export default App;
