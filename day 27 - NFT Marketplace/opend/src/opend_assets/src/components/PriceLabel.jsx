import React from "react";

function PriceLabel(props) {
    // The button component was created for the NFT selling function, the html was given in Readme
    return (
        <div className="disButtonBase-root disChip-root makeStyles-price-23 disChip-outlined">
          <span className="disChip-label">{props.price} KEKW</span>
        </div>
    )
}

export default PriceLabel;