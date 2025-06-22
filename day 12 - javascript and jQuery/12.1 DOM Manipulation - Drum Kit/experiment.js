/* In order to make the button interactive, we need to add an event listener to it
For that, we need to select a target, in this case a button, and add it.
docs: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener */

/*
document.querySelector('button').addEventListener('click', handleClickOne);
*/
function handleClickOne() {
    alert('This is the first handleclick function.');
}

/* In this code, first the first button in the document is selected, then an event listener is added to it
We need to add an event type as string, in our case it is click. Then we need to add a listener, which is a JavaScript function
We should NOT call the function here i.e. keep it without parentheses because we want to execute function when we click, not when script is run
We can give a name to the function, or we can also put an anonymous function inside the addEventListener parentheses like this: */

document.querySelector('button').addEventListener('click', function () {
    alert('This is another handleClick function.');
});
/* In this one, we didn't give it a name but instead passed the entire function inside
Sidenote: currently we have two event listeners to both functions will be executed */

/* A challenge here is to add the event listener to all the buttons instead of just one. Since we need the same function probably, I'll use handleClickOne
I may as well comment out the first event listener at this point */

// For the purposes below, we're ditching handleClickOne for a different handleClick function
/*
var allButtons = document.querySelectorAll('button.drum');
for (var i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener('click', handleClickOne);
}
*/
/* Well this is how I handled it, she said there was a messy way and a better way, no idea which I did
(After watching): Looks like looping was the way, and the messy method was to write the line 7 times from 0 to 6
Anyway, maybe I should change the query string because just writing buttons is not a good practice, and we've got a class in the html anyway */

// Console Tricks
/* In the chrome developer tools we have some options.
When we inspect on a certain element, we can go to the console and reference that element using a $0 for example, we can add an event listener to it:

$0.addEventListener("click", clickHandler);

We can also use the debugger when we don't know what our code is doing or we can't figure out what is going wrong in our process
For that, we can follow this format in the console:

debugger;
(the code that we want to examine)

This will load up a step by step viewer where we can see what is called where and what value is passed where */

// addEventListener function
/* This function is a bit different than the ones before, because this one takes another function as an input
It takes a event type string as an input, and executes a function when the event is detected on the target
These functions are called higher order functions and not every progrmaming language has them, but JS, Swift, Pascal, C++ do
An example of a calculator was shown, along with challenge to add more functions to make it complete
Here's how it works: */

function add(n1, n2) {
    return n1 + n2;
}
function sub(n1, n2) {
    return n1 - n2;
}
function mul(n1, n2) {
    return n1 * n2;
}
function div(n1, n2) {
    return n1 - n2;
}
function calculator(num1, num2, operator) {
    return operator(num1, num2);
}
console.log('Multiplication of 4 and 6: ' + calculator(4, 6, mul));

/* In this code, instead of calling individual functions for the operation, we can simply call the calculator
In doing so, we can pass the operator function, like we did in the event listener function
The passed function would be then used to operate on the given two numbers */

// Playing audio on a website
/* In order to play an audio, we need to create a new Audio object and then use the method .play() on it, pretty simple.
The challenge was to add an event listener to the buttons to play it, but since our buttons are crowded with event listeners
I'll maybe add it to the heading, so an audio plays when the heading is clicked */

document.querySelector('#title').addEventListener('click', function () {
    var audioFile = new Audio('./sounds/tom-1.mp3');
    audioFile.play();
});
/* This code is new, and we don't know how it works, so we have to search for it and we can find it on the MDN Docs
it creates a HTML <audio> element and stores it in the variable audioFile then we can play that using the play() method */

/* okay now we need to work with each of the buttons and their behaviors, so we need to comment the code inside the loop above, so that I can handle it below instead */
var allButtons = document.querySelectorAll('button.drum');
for (var i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener('click', function () {
        /* Inside this function, I can use the "this" keyword to refer to the button element which has been clicked */
        console.log(this);

        // A challenge here was to change the text color of the button clicked into white
        this.style.color = 'white';
    });
}

// JavaScript Objects
/* When we have repititive variables, like date of birth of people, names, etc, assigning each to a different variable is tedious
We can instead create an object for the person and store their properties as the properties of that object
An example was shown in the course about a bell boy, and challenge was given to create a housemaid object. Here's the challenge: */
var houseMaid1 = {
    name: 'Ella',
    age: 22,
    hasWorkExperience: true,
    designatedRooms: ['kitchen', 'living'],
};

/* Now that the object is created, we can access it using: */
console.log(houseMaid1);
// We can also access individual properties using the dot notation like:
console.log(houseMaid1.name);

/* The properties of an object are just variables inside another variable
In this way we can create many objects but creating objects like this is still tedious, having to assign variables ourselves
In order to make this easier, we can have a Factory function that creates these objects since they all have the same properties
We call this kind of a function a "constructor function". It looks like this: */
function HouseMaid(name, age, hasWorkExperience, designatedRooms) {
    this.name = name;
    this.age = age;
    this.hasWorkExperience = hasWorkExperience;
    this.designatedRooms = designatedRooms;
}
/* This constructor function always has a capital letter at the start of its name, that is how we know it is a constructor function
We can create objects easily using this function as: */
var houseMaid2 = new HouseMaid('Stacy', 27, true, ['lounge', 'bathroom']);
/* We can simply pass the parameters as defined earlier, and it will create a HouseMaid object, stored into the variable houseMaid2 */

/* Now onto the next part of the course. I think we'll just do the actual thing in the index.js file but we'll use the switch statement
It is a kind of an alternative to the if statement, where we have multiple options, like the different keys in the buttons. The structure looks like */
var test = 'apple';

switch (test) {
    case 'apple':
        console.log("Yay it's apple");
        break;
    case 'bananas':
        console.log("No, it's bananas");
        break;
    case 'mango':
        console.log("Hmm, it's mango");
        break;
    default:
        console.log('What even is ' + test);
}
/* In this way we can switch on a variable and check for its value, and then define what to do in each case
We need to add the break statement because else all the cases will be run. Also default is optional, but it is good for when unexpected happens
I think I'll write the code in the index.js because this is enough to play the drum with clicks */

/* Apart from properties, objects can also have methods associated with them, they can be made to do certain things
A challenge was to modify the factory for HouseMaid, and add a method, I will just create a different constructor called HouseKeeper */
function HouseKeeper(name, age, yearsOfExperience, preferredRooms) {
    this.name = name;
    this.age = age;
    this.yearsOfExperience = yearsOfExperience;
    this.preferredRooms = preferredRooms;
    this.clean = function () {
        alert('Cleaning in progress');
    };
}
var houseKeeper1 = new HouseKeeper('Maria', 36, 13, ['store', 'library']);
houseKeeper1.clean();

/* This looks eerily similar to the way we played an audio above. It's like the Audio was simply:
function Audio (fileLocation) {
    this.fileLocation = fileLocation;
    this.play = function () {
        playing_function;
    }
}
*/

/* Now we need to be able to play the sound when a key is pressed on the keyboard. For that we need to add another event listener
But what should be the target? When we were clicking, we clicked on a button, but this time, we're just detecting a press on the keyboard
We can set the entire document as the target, and add the listener, but how do we know what key was pressed?
We can pass an optional parameter to the function that gets executed at the event called "event" or simply "e" and it is an event object
https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
In our case a KeyboardEvent object is passed as parameter and it has a property called key which has the required key. We can use: */

document.addEventListener('keydown', function (event) {
    console.log(event);
    console.log(event.key);
});
// This just logs out the event function, and the key that was pressed in the keyboard event
// In the course, the event type was "keypress" but since it has been deprecated, we'll be using keydown

// Callbacks
/* During our addEventListener call, we passed in a function, the addEventListener function is a higher order function
But the function passed into it is called the callback. Let's assume this is what the addEventListener does: */
function notAddEventListener(typeOfEvent, callback) {
    // Detect the event

    var eventObject = {
        type: 'keypress',
        key: 'g',
        duration: '2',
    };

    if (eventObject.type === typeOfEvent) {
        callback(eventObject);
    }
}
/* We can see that this looks similar in structure, as in we pass a type of event and a callback function
This function later gets called if the type of event matches the event type, and an event object is pased to the callback function
So we can do these: */
notAddEventListener('keypress', function (event) {
    console.log(event);
    console.log(event.key);
});
/* This works similarly to the addEventListener function, the difference being that we're calling this function
But addEventListener is called by the object listening to the event. */

/* The next part is adding animations but since that is directly related to the task at hand, I will do it inside index.js */
