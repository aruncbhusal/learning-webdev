import React from "react";

function Entry(props) {
  return (
    <div className="term">
      <dt>
        <span className="emoji" role="img" aria-label={props.item.name}>
          {props.item.emoji}
        </span>
        <span>{props.item.name}</span>
      </dt>
      <dd>{props.item.meaning}</dd>
    </div>
  );
}

export default Entry;
