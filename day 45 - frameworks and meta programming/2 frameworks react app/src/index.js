import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';

// I wrote none of the code in this one, but I'll add comments for reference
// This was just shown as an example of using React to do the same thing we did in the last project: Share my place
// Here we can see the jsx syntax being used:
ReactDOM.render(<App />, document.getElementById('root'));
// This <App /> simply gets translated into document.createElement('App')
// React uses jsx so that our jsx looks like html and we don't need to do the DOM manipulation much
// The main code is in App.js
