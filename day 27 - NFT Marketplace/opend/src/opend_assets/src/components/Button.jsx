import React from "react";

function Button(props) {
    // The button component was created for the NFT selling function, the html was given in Readme
    return (
        <div className="Chip-root makeStyles-chipBlue-108 Chip-clickable">
            <span
                onClick={props.action}
                className="form-Chip-label"
            >
                {props.text}
            </span>
        </div>
    )
}

export default Button;