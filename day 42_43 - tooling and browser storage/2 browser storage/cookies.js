// Cookies are set so that we can send it to the server with the Http requests. We need a backend for this to work
// In order to access the cookies we use document.cookie, and to add a value to it we simply use document.cookie = 'some data'
// This internally works by invoking a setter function so it doesn't override the data but instead adds to it
// We can see the data inside applications tab here as well

const storeBtn = document.getElementById('store-btn');

const thing = 'Somebody once told me';
storeBtn.addEventListener('click', () => {
    document.cookie = `lyrics=${thing} max-age=50`;
    // By setting max-age=50, we set a flag which only lets this cookie live for 50 seconds, after which it expires
    // This flag isn't a part of the cookie string when shown, however
    // We can store an object in the same way as
    const userInfo = { name: 'Colin', age: 25 };
    // If we already have a cookie with the same key, it does replace it though, so it doesn't have two cookies with same key
    document.cookie = `user=${JSON.stringify(userInfo)} expires=2025-10-10`;
    // This way we can set the expiry date for a cookie, rather than how manhy seconds since created
    // We have many other flags as well
});

const retrieveBtn = document.getElementById('retrieve-btn');

retrieveBtn.addEventListener('click', () => {
    console.log(document.cookie);
    // in order to access just a single part we can split it using ; since the different entries are separated with it
    // Also we need to trim the extra white spaces. And we store them as key=value so splitting with = can separate key and values as well
    const cookiePairs = document.cookie.split(';').map((item) => {
        const separated = item.trim().split('=');
        return { [separated[0]]: separated[1] };
    });

    // But this might not always be enough since we might not know the order in which the keys are there in the cookie
    // So we need to do a .find in order to find the exact cookie we might want, in this case I want 'user' so I'll search
    console.log(
        cookiePairs.find(
            (item) => Object.keys(item)[0].toLowerCase() === 'user'
        )
    );
});
// But it doesn't work from the file system because we need to set this with a server, so let's first start a server
// We can read more at: https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
