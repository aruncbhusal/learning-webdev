import React from "react";

/* Our card component is fine but there are components even inside this that we may want to reuse.
Like the circle image component. That can be useful in other parts of the site as well
So we can create a new file and export it from there. but doing so, we need to pass the props.img to it as well
The challenge was to make it work even when separated into a different file by using props */
import CircleImage from "./CircleImage";
/* After creating a component inside component and passing props from one to another, it might get confusing
We can install the React Developer Tools extension in Chrome/Firefox offered by Facebook, and use it in the Dev Console
When we open the Developer Tab, we can see a Components tab which is from the extension and shows the Component Tree
It can be used to see, and even edit the different props being passed from one component to another inside it
We can also turn on html elements to be seen as well, but components view is cleaner. */

/* Since the paragraph tags for details are also redundant, with same class and whatever, we can separate them too */
import Details from "./Details";

/* Since we're now also passing the id(key), we can also use it inside the Card. Let's add a h2
But it doesn't appear, and we see an error in the console saying key is not a prop. React Dev tools confirms it.
In order to use the value passed to the key, we need to create a brand new prop which has the same value to pass. */

function Card(props) {
  return (
    <div className="card">
      <div className="top">
        <h2>{props.key}</h2>
        <h2 className="name">{props.name}</h2>
        <CircleImage img={props.img} />
      </div>
      <div className="bottom">
        <Details data={props.tel} />
        <Details data={props.email} />
      </div>
    </div>
  );
}

export default Card;
