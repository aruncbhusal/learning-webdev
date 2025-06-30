/* When we create an element like input inside html, we can set its value, placeholders, and other attributes
We can also get hold of those attributes using JS. But there are only so many attributes in HTML
We cannot simply create our own attribute and add data into it, but with React components, we can
In the following React render, we have three profiles with information but it's repititive, perfect place to use a component
But in order to make it reusable, we can allow the component to take values as attributes (properties) from the render
We can then use a variable in the parameters of the component to store the object containing all values. We generally call it "props"
Then we can access the value from the properties of the "props" object. An example is below */

import React from 'react';
import ReactDOM from 'react-dom';

function Card(props) {
    return (
        <div>
            <h2>{props.name}</h2>
            <img src={props.img} alt="avatar_img" />
            <p>{props.phone}</p>
            <p>{props.mail}</p>
        </div>
    );
}

// A single card was shown as a "how to do it", then the exercise was to add more cards. I'll just use the info that's already there

ReactDOM.render(
    <div>
        <h1>My Contacts</h1>

        <Card
            name="Beyonce"
            img="https://blackhistorywall.files.wordpress.com/2010/02/picture-device-independent-bitmap-119.jpg"
            phone="+123 456 789"
            mail="b@beyonce.com"
        />

        <Card
            name="John Doe"
            img="https://pbs.twimg.com/profile_images/625247595825246208/X3XLea04_400x400.jpg"
            phone="+987 654 321"
            mail="john@nowhere.com"
        />

        <Card
            name="Chuck Norris"
            img="https://i.pinimg.com/originals/e3/94/47/e39447de921955826b1e498ccf9a39af.png"
            phone="+918 372 574"
            mail="gmail@chucknorris.com"
        />
    </div>,
    document.getElementById('root')
);
// Funny Chuck Norris easter egg here. gmail@chuck instead of chuck@gmail. Nice.

// After this, the actual index.js will have the code for the practice part of props.
