import React from "react";
import Card from "./Card";
import contacts from "../contacts";

/* We can see that the current way of adding cards is redundant, especially because we're just using the same array
But we can use a JS Function called Map which takes a function as an input.
We can use it on an array so that for each element in the array, the function is called
We can create a new function as: */
function createCard(contact) {
  return (
    <Card
      key={contact.id}
      name={contact.name}
      img={contact.imgURL}
      tel={contact.phone}
      email={contact.email}
    />
  );
}
// We must use a prop called "key" in order to identify each component made with a map,
// since we already have id in the array, we can do it easily. We can use the map as below

function App() {
  return (
    <div>
      <h1 className="heading">My Contacts</h1>

      {contacts.map(createCard)}

      {/* <Card
        name={contacts[0].name}
        img={contacts[0].imgURL}
        tel={contacts[0].phone}
        email={contacts[0].email}
      />
      <Card
        name={contacts[1].name}
        img={contacts[1].imgURL}
        tel={contacts[1].phone}
        email={contacts[1].email}
      />
      <Card
        name={contacts[2].name}
        img={contacts[2].imgURL}
        tel={contacts[2].phone}
        email={contacts[2].email}
      /> */}
    </div>
  );
}

export default App;
