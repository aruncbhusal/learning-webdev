/* Objects are core JavaScript data types(structures) that are usually used to model real word entities
There are two types of data in JS, the primitive type, and the reference type. Reference type data are objects
So arrays, pure objects, DOM Nodes, etc are all objects
An object has properties and methods that describe the attributes and actions of the object
Primitive values are the building blocks of objects. An object may have an object inside it but the lowest level has primitive values
*/

// We can create an object with key value pairs, storing the properties and methods as:
const person = {
    name: 'Gary',
    age: 43,
    hello: () => {
        console.log('Hello');
    },
};
// In order to add a new property to the object, we can simply select the property(which is undefined initially) and assign a value
console.log(person);
person.isMarried = false;
console.log(person);
// We can also delete a property from an object using the delete keyword
delete person.age;
// When we try to access the age property, we now get undefined, and it doesn't appear in the object
// We could set this value to undefined, JS doesn't prevent us, but it is recommended to never assign undefined as a developer
// We should let JS assign it to values that don't exist yet/have been removed. We can use null but it doesn't remove from object
// It shows a null value but the property still exists, which might be useful for uniformity reasons.
console.log(person);

// Key names: All variable names are valid key names, but not all key names are valid variable names
// The keys of an object are stored as strings, even if we don't specify it, JS coerces them into strings so 'name' is same as name
// We can create a new object as:
const person2 = {
    'first name': 'Maria',
    age: 19,
    4: 'Four',
};
// But with the dot notation, we can't access the value for first name key as it requires that there be no spaces
console.log(person2.age);
// This works no problem but 'person2.first name' doesn't work so we can instead use the square bracket notation, just like arrays
console.log(person2['first name']);
// If we use person2[age] it tries to find a variable in this scope called age to use its value as the key name
// Inside the square brackets we should always have strings.
// In the DOM, when using css properties like background color, we can also use the normal css property names with this notation
// someElement.style.backgroundColor = 'white';
// is the same as
// someElement.style['background-color'] = 'white';

// An array is a kind of object, it has number keys, so we can store numbers as keys in an object easily, but number should be 0 or up
// They too are stored as strings, to access them, we can use
console.log(person2[4]);
// Adding quotes around the number is optional, again we can't use person2.4 because 4 isn't a valid variable name

// The order of properties in an object is maintained in the same order as it they are inserted
// In case of number keys it doesn't apply, since smaller key appears in front, which makes sense because of the behavior of array

// We can also use square bracket notation to specify keys dynamically, by storing in a variable
const someUserInput = 'bob';
const randomObject = {
    [someUserInput]: 'chill',
};
// Now we can use the same dynamic key to access it, or we can use the key name itself
console.log(randomObject[someUserInput]); // randomObject.someUserInput is not valid because the property is bob

// Object spreading
// Similar to arrays, we can also spread an object to create a non-identical copy
const personOne = {
    name: 'Brad',
    age: 32,
    skills: ['singing', 'gaming'],
};
// Now if we simply create a new person as
const stillPersonOne = personOne;
// And if we change something in original object
personOne.age = 21;
// This changes both the objects
console.log(personOne, stillPersonOne);
// But if we use spreading to create the new array
const notPersonOne = { ...personOne };
// We can change this person's name and it will not affect personOne
notPersonOne.name = 'Larry';
// But this copies all the elements, meaning the array that is held under the skills property is copied by reference
// So if we change the original person's skills it will still be updated in the new object, because they hold the reference to same array
personOne.skills.push('drawing');
console.log(personOne, notPersonOne);
// In order to avoid this and create a full copy, we need to add further steps to copy each of such properties that hold references
// In this case we can use the array spreading on skills array to make sure a copy is stored in the new object
// We can even change the attributes while initializing by changing the properties inside the inintialization curly braces
const notPersonOneEither = {
    ...personOne,
    age: 19,
    skills: [...personOne.skills],
};
// Now if I pop out a skill from the array, the change will only affect this new object
notPersonOneEither.skills.pop();
console.log(personOne, notPersonOneEither);

// We also have a method inside the Object object called assign() which takes two objects and copies properties and methods of 2nd to 1st
// If we supply an empty object in the first parameter, it will simply copy the second object completely just like the spread operator
// This can be useful because not all browsers might support the spread operator
const stillNotPersonOne = Object.assign({}, personOne);
// Now if we change this person's name
stillNotPersonOne.name = 'Hank';
console.log(personOne, stillNotPersonOne);

// Object Destructuring
// When we're only interested in a part of the object, we can store it inside another variable just like we did with arrays
// Similar to array destructuring, we can use the rest paramter here as well which stores all remaining ones in a separate objcet
const { name, ...remainingPersonOne } = personOne;
console.log(name, remainingPersonOne);
// Since the property name (key) may not be available as a variable because of some other variable with same name or reserved words
// We can store the value of the key in a different variable by specifying the name after colon
const { name: notPersonOneName } = notPersonOne;
console.log(notPersonOneName);

// Checking existence of a property
// When we're working with dynamic objects, we might not always be sure whether a given property is present in the object
// To check for the property, we can use the in keyword
console.log('age' in stillNotPersonOne); // Should be true
// Another way to do so is to simply check for the property and see whether it is undefined
console.log(stillNotPersonOne.gender === undefined); // Should be false

// Arrow functions and 'this'
// Though mostly when we're working with methods in arrays, we use normal functions instead of arrow functions
// because they don't know that 'this' is the object, and assume it is the window instead
// There are cases where they might be preferred over the normal functions for using 'this'
const someObject = {
    title: 'Mango',
    components: ['peel', 'pulp', 'seed'],
    goThroughStuff() {
        this.components.forEach((thing) => {
            // Since we're using a normal function 'this' refers to the object

            // But this function is called by forEach and not us, so its 'this' would be the the global context i.e. window
            // By using an arrow function, we don't allow this function to have its own this, but rather borrow from outside
            // The outer context of this function is the goThroughStuff function, whose 'this' refers to the object itself
            // So we can use
            console.log(this.title + ' ' + thing);
        });
    },
};
someObject.goThroughStuff();

// this keyword summary: What it returns when it is used where:
// 1. In the global context/outside of any function: Returns the global object (window in browser), even in strict mode
// 2. In a non-arrow function called in the global context: Global object normally, undefined in strict mode
// 3. In an arrow function called in the global context: Global object always, even in strict mode
// 4. In a non-arrow method called on an object (eg. person.getName()): refers to the object which called it (here, person object)
// 5. In an arrow method called on an object: refers to the global object, even in strict mode

// 6. Edge case: calling a method on an object which borrows the method from another object
// If we have an object with a method and another without, we may use object2.methodReplica = object1.method to copy a method
// But this new method if called with object2.methodReplica(), 'this' will refer to object2 instead of object1 where it was created
// When in doubt, we should always use console.log(this);

// Getters and Setters
// When we want to have control over what values can be inside a property, we can use getters and setters, which must be together
const anotherObject = {
    set name(value) {
        // Inside the set function, we can work with an internal property which is used to set the name property
        console.log('Setter was called, value: ', value);
        if (value.length > 10) {
            this._name = value;
        } else {
            this._name = 'SHORTER THAN 10 CHARACTERS';
        }
        return;
    },
    get name() {
        console.log('Getter was called');
        return this._name;
    },
};
// When we try to assign a value to the name property of this object, the setter is called. And when we want to read , getter is called
anotherObject.name = 'Ganga Snaan';
console.log(anotherObject.name);

/* Since we'll be working on the html file, I have separated this into a separate file and added a commented line in html to use it. */
