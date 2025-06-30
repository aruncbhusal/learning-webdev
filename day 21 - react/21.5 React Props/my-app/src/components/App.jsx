import React from 'react';

/* I will create the card inside this file, so that I don't have to juggle components, for now
But before that we need to fix the styling. The h2 needs class "name", image needs 'circle-img', p tags need "info"
Finally, now let's get the card into its own function */
import contacts from '../contacts';

function Card(props) {
    return (
        <div>
            <div className="card">
                <div className="top">
                    <h2 className="name">{props.name}</h2>
                    <img
                        src={props.image}
                        alt="avatar_img"
                        className="circle-img"
                    />
                </div>
                <div className="bottom">
                    <p className="info">{props.phone}</p>
                    <p className="info">{props.mail}</p>
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <div>
            <h1 className="heading">My Contacts</h1>
            <Card
                name={contacts[0].name}
                image={contacts[0].imgURL}
                phone={contacts[0].phone}
                mail={contacts[0].email}
            />
            <Card
                name={contacts[1].name}
                image={contacts[1].imgURL}
                phone={contacts[1].phone}
                mail={contacts[1].email}
            />
            <Card
                name={contacts[2].name}
                image={contacts[2].imgURL}
                phone={contacts[2].phone}
                mail={contacts[2].email}
            />
        </div>
    );
}
// The code looks almost the same, I asked GPT for a loop like method and it said map,
// which she mentioned at the end as well

export default App;
