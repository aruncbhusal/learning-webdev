import React from 'react';
import ReactDOM from 'react-dom/client';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<h1>Hello</h1>);

/* We used to be able to use ReactDOM.render() to render until React 17 and since React 18 render() has been replaced
Instead we now use createRoot from react-dom/client then render into the root from there
According to GPT, it was done in order to add concurrent rendering ability.
So even though the course will be using the React16 syntax, I will be using React19 with this change */

/* Props Challenge: Copying the index.js and other files to this folder from the challenge sandbox */
import App from './components/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

//1. Apply CSS styles to App.jsx component
//to match the appearance on the completed app:
//https://c6fkx.csb.app/
//2. Extract the contact card as a reusable Card component.
//3. Use props to render the default Beyonce contact card
//so the Card component can be reused for other contacts.
//4. Import the contacts.js file to create card components.
