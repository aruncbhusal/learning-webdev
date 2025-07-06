import React, { useState, useEffect } from "react";
import Item from "./Item";

function Gallery(props) {
  // We have the NFT IDs sent, so we need to fetch them here
  const [items, setItems] = useState();
  async function fetchNFTs() {
    if (props.ids != undefined) {
      // We need to send the mode as well to render differently
      setItems(props.ids.map(nftId => <Item canisterID={nftId} key={nftId.toText()} mode={props.mode} />))
    }
  }

  // Again we load the nfts each refresh
  useEffect(() => {
    fetchNFTs();
  }, [])

  return (
    <div className="gallery-view">
      <h3 className="makeStyles-title-99 Typography-h3">{props.title}</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
            {items}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
