import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import SharePlace from './Pages/SharePlace';
import MyPlace from './Pages/MyPlace';

// This is the core of the application, which uses a BrowserRouter from react router which is part of the React ecosystem
// Here we allow the user to be routed to different pages with different routes, but we only have one index.html with the skeleton
// Now the code for each of these pages are in SharePlace and MyPlace
function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={SharePlace} exact />
                <Route path="/my-place" component={MyPlace} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
