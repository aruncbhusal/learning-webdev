// Browser storage, unlike storing data in the server, is used for user-specific data to be stored temporarily and is not critical.
// In the server we store important data that are meant to persist, like user list, product list, etc, and in browser we have things like cart
// There are different kinds of browser storage available, all of them can be accessed using JavaScript and user can also remove them
// 1.localStorage, sessionStorage: key value pairs, can be used for authentication, user config, simple to use
// 2. Cookies: key value pairs, can be sent to server with headers, stores identy or other data, clunky to use
// 3. IndexedDB: for complex types of data, clunky to use, useful for client side applications because great performance

// Local Storage and Session storage
// Let's say we want to store a session ID and user information in local and session storage
const sessionId = 'iykwim';
const userInfo = {
    name: 'Riley',
    age: 22,
};

// We have buttons so let's use them

const storeBtn = document.getElementById('store-btn');

storeBtn.addEventListener('click', () => {
    // We can only store strings inside the local/session storage, so we need to convert the object to string with stringigy
    // If we use toString the result is [Object object] which is what it does when we put it directly
    // We have many methods in local and session storage, we can clear it, get a single item, set item, find the index of a key, etc
    sessionStorage.setItem('sid', sessionId);
    // The data in a session storage persists only for a single session i.e. when the tab is closed/browser is closed, and restarted
    // The data is lost. But the data in local storage persists as long as it is not cleared by JS/user/browser(if disk space is low)
    localStorage.setItem('uinfo', JSON.stringify(userInfo));
    // Both sessionstorage and localstorage can be freely modified, removed by the user so we should not take it as a source of truth
});

// In order to retrieve the data from localstorage we have getItem method
const retrieveBtn = document.getElementById('retrieve-btn');

retrieveBtn.addEventListener('click', () => {
    // Let's not use if statement here like the course
    console.log(sessionStorage.getItem('sid') || 'Session ID Not Found');
    console.log(
        JSON.parse(localStorage.getItem('uinfo')) || 'User Info Not Found'
    );
    // I had used && instead of || and started worrying
});

// We can see the storage data inside applications tab of developer console
