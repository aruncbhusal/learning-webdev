// This module covers things that may not be used often from a web developer's standpoint but someone who develops libraries and APIs
// They help to shape the way the code behaves and allows for a better experience for the developer

// Symbols: The less used primitive value
// It is a primitive value similar to number, string, boolean, etc, but it is used as object property identifier
// It is built in and developers can create symbols simply, and uniqueness is guaranteed
// Let's create a new symbol
const userid = Symbol('uid'); // We can also leave it empty, Symbol() works. We're just adding 'uid' inside for our identification purposes
// Now we can use it inside an object as the id, so that it can't be modified by the developer. While creating a library we can use this
const user = {
    [userid]: 'u1',
    name: 'Trisha',
    age: 22,
    [Symbol.toStringTag]: 'User',
};

// Now when the developer using our library wants to use it, they can't change the value stored to that symbol because that symbol is unique
// If they try to do
user[Symbol('uid')] = 'u2';
// it would simply add another symbol key becase every symbol is unique, so as long as the userid variable can't be used, we can't change the id
console.log(user);
// We can verify that two Symbols are different by simply comparins
console.log(Symbol() === Symbol());

// There are some well known symbols present in JS since ES5, and these include Symbol.iterator which is accessed when using forEach or similar
// They help to iterate over an array or other iterable object
// Also there are some properties that make Symbol act as an object with static properties like toStringTag
// When normally using toString on an object it returns [object Object] but by using a key with Symbol.toStringTag we can change it
// We have used it above, so let's try logging it here: It will show [object User]
console.log(user.toString());
// Read more: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol

// Iterator
// An iterator is an object which has a next() method. Let's say we have an object:
const fruits = {
    curFruit: 0,
    names: ['Grapes', 'Pomegranate', 'Cherry', 'Starfruit', 'Lytchee', 'Kiwi'],
    next() {
        // Inside here, we will return the last fruit in case the curFruit is the last one
        if (this.curFruit >= this.names.length) {
            return { value: this.names[this.curFruit], done: true };
        }
        // But if not,we can simply return the current fruit
        const returnValue = { value: this.names[this.curFruit], done: false };
        this.curFruit++;
        return returnValue;
    },
    [Symbol.iterator]: function* fruitGenerator() {
        // Here we can simply loop over the array of fruit names
        for (let i = 0; i < this.names.length; i++) {
            yield this.names[i];
            // The yield keyword is like return, but instead it simply provides the current value and pauses execution until next time next is called
        }
    },
};

// Now we can use this iterator object with a loop, which will allow us to iterate over only the values we need
let fruit = fruits.next();
while (!fruit.done) {
    console.log(fruit);
    fruit = fruits.next();
}

// Generators: Creating iterators simply
// The next() inside our fruits would work with for...of since it is nothing special, just a function name, but we can instead use a generator
// This way JS knows it is an iterator and we can use for...of loop with it
// For it we need to add another key with Symbol.iterator, and it has a function* which is the keyword for defining a generator
// Then it creates its own next function and we can iterate using it
// We have added a generator to the fruits object, we can use the implicitly created next() function to iterate over the fruits
// let curr = fruits.fruiter();
// console.log(curr.next());
// This doesn't work when we use Symbol.iterator key since we'd need the key to be able to access the function
// We can instead simply use the for...of loop and it will treat this object as an iterable, and we can also use spreading
for (item of fruits) {
    console.log(item);
}

console.log([...fruits]);
// This is what arrays and string to internally, and we can find Symbol.iterator inside array object's __proto__

// Reflect API
// It is an object that can help us change the behavior or meta properties of an object
// It has properties like definePrototype, defineProperty, etc. but those are also available with the Object global object
// But Reflect API is a newer addition, since ES6, which bundles all meta object changing methods into a single object
// Like Object is forgiving for many things and returns undefined, while in the same cases Reflect might trigger an error, which is more useful
// Also we might want to delete a property from an object, for which there is no method on the global object
// But Reflect API offers all such properties within itself
const book = {
    title: 'Tom and Perry',
    author: 'Deranged Knife',
};
console.log(book);
// We can delete an attribute using delete
delete book.author;
console.log(book);
// But we can also do the same wiht Reflect API
Reflect.deleteProperty(book, 'title');
console.log(book);
// More: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect

// Proxy API
// It is yet another construct which allows us to define how the code is executed, it basically sets a trap for operations on an object
// Say we have some title in the book
book.title = 'Great Wall';
// Then we can create a new Proxy by giving it two arguments, the object itself, and the proxy handler object
// We can create the proxy handler ourselves
const bookHandler = {
    // here we can have methods that are predefined ones that we can use on the object
    // We can read about it here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#A_complete_traps_list_example
    // We can modify the get() method here which is triggered every time we try to access something
    get(obj, propName) {
        // Here we take two arguments, the object, as well as the property asked to be accessed
        console.log(`You tried to access ${propName}`);
        return obj[propName] || 'NOT FOUND';
    },
    set(obj, propName, value) {
        // In this we can determine the behavior of assigning a value
        if (propName === 'rating' && value > 5) {
            return;
        }
        obj[propName] = value;
        // We set all values normally apart from if rating is greater than 5, then we don't
    },
    // This is different from getters setters because we do much more than a single value/property
};

const proxyBook = new Proxy(book, bookHandler);

console.log(proxyBook.title, proxyBook.author);
// This way we can modify behavior of code

proxyBook.rating = 6;

console.log(proxyBook); //no rating property here
