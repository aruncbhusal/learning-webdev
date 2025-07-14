class AgeDealer {
    whatAge() {
        console.log(`I am ${this.age} years old.`);
    }
}

// We have seen that we can create a class like this
class Person extends AgeDealer {
    // Adding a field, which translates to a property when an object is created from it
    name = 'Tanya';

    // Adding a constructor with a propery
    constructor() {
        // When extending we must call super constructor before using 'this'
        // This is because the base class must be constructed first, then it is added as a prototype for this one
        super();
        this.age = 23;
    }

    // And finally adding a function that can use the properties
    hello() {
        console.log(`Hi I'm ${this.name} and I'm ${this.age} years old.`);
    }
}

const p = new Person();
p.hello();

// But classes are relatively new concepts. We can also define a contructor function (with name starting with capital)
function AlsoPerson() {
    // When we use 'new' keyword with this function, it creates a 'this' object and then we can assign to that object,
    // which we are doing below, and at the end it returns the 'this' object. That is effectively what is happening

    this.name = 'Tanya';
    this.age = 23;
    this.hello = function () {
        console.log(`Hi I'm ${this.name} and I'm ${this.age} years old.`);
    };
    // This way of assigning properties/methods is not exactly identical but it is almost the same and will act in the same way
}
// Constructor functions have been in JavaScript for a lot longer than classes

const alsoP = new AlsoPerson();
alsoP.hello();
// Here the new keyword is importatnt, because otherwise, a constructor function is no different from a normal function
// Using uppercase letters as function name is only a convention and doesn't change anything
// If we omitted new when creating the object, it would simply call the function and since it returns nothing,
// the new object wouldn't have the hello method and hence would throw an error.

// Essentially, classes are just syntactic sugar for constructor functions in this case
// In case of the function, the function is executed, setting each value in the object before the full object is created
// In the case of a class, the special constructor() function does that for us

// Prototype: One of the most important parts of JavaScript
// Javascript is based on prototypes and prototypical inheritance: where functionality can be shared between objects
// by having "fallback" to prototype methods and properties
// When we log out the object we created using the constructor function, we can see a __proto__ object automatically there
console.log(alsoP);
// When we create an object by any means, it has a prototype object, which is essentially a fallback object
// When we don't have a property/method on the object we created, but we try to call it, JS will look inside prototype object
// The prototype object also has a prototype since it too is an object, until we reach the base Object object
// This forms a 'prototype chain' where first the object is checked, then the prototype, then prototype's prototype and so on
console.log(alsoP.toString());
// This is not a method we defined, but we can find it inside the prototype as:
console.log(alsoP.__proto__);

// In fact the function object also has a prototype, we can see it by logging it out
console.dir(AlsoPerson);
// But it also has another property called 'prototype' which is the same as the __proto__ of any object created from this function
// We can even check it using comparison to see that they refer to the exact same object in memory
console.log(AlsoPerson.prototype === alsoP.__proto__);
// Since this is true, the __proto__ property of the actual function is obviously different compared to __proto__ of the object
console.log(AlsoPerson.__proto__ === alsoP.__proto__);
// Looks like Chrome displays __proto__ as [[Prototype]] for some reason

// This is like adding a base prototype to the function we create
// We can even define the prototype ourselves
// AlsoPerson.prototype = {
//     whatAge() {
//         console.log(`I am ${this.age} years old.`);
//     },
// };

// Since the above method replaces the existing prototype object with the one we define,
// we can instead use this format to add to the object instead
AlsoPerson.prototype.whatAge = function () {
    console.log(`I am ${this.age} years old.`);
};
// Using this prototype is NOT for the function itself but for any objects that we create with this function as a constructor
const alsoP2 = new AlsoPerson();
alsoP2.whatAge();
// We can clearly see that extending a class is basically a syntactic sugar for adding a prototype to it.

// We can test it by creating a new WhatAge function inside another class then inheriting from that class into Person
// The object we created using the class has a constructor function, and the __proto__ method as well
console.log(p.__proto__);
// But one thing we can notice is that whatAge function is not a part of this prototype but instead a prototype of this prototype

// The constructor function inside this prototype can be used to create the object as well, useful when original function not available
const p2 = new p.__proto__.constructor();
console.log(p2);

// The Global Object
// When we log out the global object
console.dir(Object);
// We can see that it has different properties, but we can't access those properties on any random function
console.log(p.length); // This yields undefined, even though the Object constructor function has a property called length
// This is because there properties are static properties i.e. properties of the function itself
// We can add such properties to our constructor function as well
AlsoPerson.describe = function () {
    console.log('Creates a person object....');
};
//We can now use this function by targeting the constructor function object itself
AlsoPerson.describe();
// But we can't access it on any object created using the constructor function
const alsoP3 = new AlsoPerson();
// alsoP3.describe();
// This throws an error because the new object doesn't share the function

// The end of the prototype chain is not Object object, since it too has a prototype
console.dir(Object.__proto__);
// But it also has Object.prototype, which is the end of the prototype chain
console.log(Object.prototype);
// This object doesn't have a __proto__ object
console.log(Object.prototype.__proto__); // Returns null

// When we look at the class and log it, we can see something interesting
console.dir(Person);
// We can see that it has properties, but its constructor and hello method are inside __proto__
// Similarly if we look at the __proto__, it should be its base class, which has a constructor
// but the whatAge method of that base class is inside this prototype's __proto__
// When we create an object from this class we can see that both age and name appear as properties equivalently
// And they need to be / are only initialized after the super() constructor method is called
const p3 = new Person();
console.log(p3);
// This is the difference between a normal constructor function and a class, methods defined in a class are defined inside prototype
// And can be found in the __proto__ of the resulting objects
// This is because a prototype is added to each new object and the same prototype can be reused for multiple instances of a class
// We can verify this by comparing the prototypes of two objects of Person class
console.log(p2.__proto__ === p3.__proto__);

// We can also create a new class that acts in the same way as the constructor function, without the added prototype
class PersonAgain {
    name = 'Jeremy';
    constructor() {
        this.age = 23;
        // Instead of defining the function below like we did previously, we can define it here as
        this.someFunction = function () {
            console.log(
                `Function inside the constructor, name is ${this.name} and age is ${this.age}`
            );
        };
    }
    // Similarly we can also define a function outside, but by assigning it to a field, instead of the way we did
    anotherFunction = function () {
        console.log(
            `Function outside the constructor, name is ${this.name} and age is ${this.age}`
        );
    };
    // This is a bit more performance intensive compared to the other method where the function is added to the prototype
    // because every time we create a new object, we also need to create this function for that object

    // Normally, using a normal function and an arrow function doesn't have a difference since it is bound to an object
    // But when the function is called by an event listener for example, 'this' changes to the caller
    // So this normal function might break. In that case we prefer arrow functions because they don't care about caller
    speak = () => {
        console.log(`Hi I'm ${this.name} and I'm ${this.age} years old.`);
    };
}
const pa = new PersonAgain();
// They work the same when we call it directly
pa.speak();
pa.someFunction();
pa.anotherFunction();

const btn = document.querySelector('button');
btn.addEventListener('click', pa.speak);
// but if we add another event listener so that we see the difference we can see that someFunction and anotherFunction will break
// when being called via the event Listener
btn.addEventListener('click', pa.someFunction);
btn.addEventListener('click', pa.anotherFunction);

// Objects like Arrays and even Strings which behave like objects, have prototypes and methods defined on those prototypes
// methods like slice, toUpperCase, shift, pop, push, concat, replace are all methods inside prototype of array/string
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String

// When we create an object literal, we don't control its property since we didn't call the constructor
// When a similar case arises when we don't have access to the constructor function or the object is already created
// We can get and set the prototype of an object using static methods of Object object
const user = {
    username: 'Gwen',
    birthYear: 2001,
};
// In order to see its current prototype, we can simply use __proto__ or we can use
console.log(Object.getPrototypeOf(user));
// And we can also set the prototype of an object
Object.setPrototypeOf(user, {
    // ...Object.getPrototypeOf(user),
    // When we're working with something that has user defined prototypes, we can use this spreading to retain prototypes
    // But since our object will always have the built in prototype, even if we change this to an object (which has a prototype),
    // we don't need to do it in this case
    getInfo() {
        console.log(
            `Name: ${this.username} and date of birth: ${this.birthYear}`
        );
    },
});

user.getInfo(); // Even though user doesn't have a getInfo function we can use it
console.log(user);

// There is another way to add prototypes to an object literal, by creating the object using Object.create()
const student = Object.create({
    // Inside the parameter, we pass an object which is to be used as a prototype
    getGrade() {
        console.log(`${this.name} is in grade ${this.grade}`);
    },
});
// Now to add the properties, we can either simply do
student.name = 'Mina';
// Or we can also use the defineProperty method
Object.defineProperty(student, 'grade', {
    // Each property can take an object which defines its descriptors
    configurable: true,
    enumerable: true,
    value: 8,
    writeable: true,
});

student.getGrade();
console.log(student);

// Another way to create an object is to pass another argument to create method with an object that contains the properties
const student2 = Object.create(
    {
        getGrade() {
            console.log(`${this.name} is in grade ${this.grade}`);
        },
    },
    {
        // Now the other argument is an object with objects named after properties that have objects for their descriptors
        name: {
            configurable: true,
            enumerable: true,
            value: 'Gina',
            writeable: true,
        },
        grade: {
            configurable: true,
            enumerable: true,
            value: 7,
            writeable: true,
        },
    }
);
student2.getGrade();
console.log(student2);

// Finally, the differences between constructor function and classes:
// Constructor functions are functions so they will give object when new keyword is used, but we can omit it and it doesn't throw
// Constructor functions have all properties and methods enumerable by default, while classes have non-enumerable by default
// Constructor functions don't have strict mode on by default, but classes always have it on by default
