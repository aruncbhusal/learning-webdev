// IndexedDB is a more sophisticated way of storing information on the browser, we can store objects through this
// In contrast to cookies, it does work on the file protocol.
// In order to use it we need to use the IndexedDB object on the window i.e. available globally, and use 'open' with a db name and version
const dbRequest = indexedDB.open('TestStorage', 1);
// We should use a name that doesn't have a db already open, to create a new one, else we can open existing as well
// This doesn't return a promise, and returns a request object on which we need to give callbacks

// We need a global db object which can be accessed anywhere
let db;
// Now we need to handle the success condition, which is when we're just accessing the objectStore, not changing anything
dbRequest.onsuccess = function (event) {
    db = event.target.result;
};

// for creating the object stores/ tinkering with the DB, we use onupgradeneeded
dbRequest.onupgradeneeded = function (event) {
    // When successful, the event.target object has a result object, it holds the db
    db = event.target.result;

    // Inside the db, we can create object stores, which are like tables in a normal db and we give a name and a keypath for primary key equiv
    const objStore = db.createObjectStore('products', { keyPath: 'id' });

    // Then we can add to this object store after the object store has been created with yet another callback for transaction complete
    objStore.transaction.oncomplete = function (event) {
        // To create an actual table like instance from the schema, we define it with object store name, actions performed like 'readonly'
        // Then we need to start a connection to the object store, resulting object can select a single object store if multiple passed in a txn
        const productStore = db
            .transaction('products', 'readwrite')
            .objectStore('products');
        // Storing it to a variable gives us direct access to the object store called products

        // Now we can add entries to this object store using the add method, and it takes a JS object, which must have the key mentioned in keyPath
        productStore.add({
            id: 'x1',
            title: 'Product 1',
            price: 9.99,
            tags: ['affordable', 'beautiful'],
        });
    };
};
// This stores data as JS Objects instead of JSON, which provides us more options

// And now for basic error handling/logging
dbRequest.onerror = function (event) {
    console.log('ERROR');
};

// For using IndexedDB well, we need to read the MDN Docs: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB

const storeBtn = document.getElementById('store-btn');

storeBtn.addEventListener('click', () => {
    // In order to add to the db, we again need to connect to the objectStore then add the object
    // This means the objectStore has already been created so we don't need to wait for that
    const productStore = db
        .transaction('products', 'readwrite')
        .objectStore('products');
    productStore.add({
        id: 'x2',
        title: 'Product 2',
        price: 99.99,
        tags: ['expensive', 'limited'],
    });
});

const retrieveBtn = document.getElementById('retrieve-btn');

retrieveBtn.addEventListener('click', () => {
    // In order to access from the db, we simply need to connect again and use the get method with the value of the key
    const productStore = db
        .transaction('products', 'readwrite')
        .objectStore('products');
    const request = productStore.get('x2');

    // When the request is successful, we can call a function to display the result
    request.onsuccess = function () {
        console.log(request.result);
    };
});
// Since this is clunky it needs practice, and we also have libraries like idb which promisify IndexDB for more straighforward work
// We can find it here: https://github.com/jakearchibald/idb

// These browser storage methods are good to improve the user experience but they are by no means a replacement for server side storage
// They can be easily modified and removed by the user with JS
