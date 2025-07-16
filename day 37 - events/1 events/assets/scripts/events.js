/* Events are important components of many programming languages because many times we may want to execute some code on an event
In Broweser side JS, the events are used via addEventListener and in server side JS i.e. NodeJs, used via on()
In JavaScript, Event is a base constructor function for all events, some events being Mouse Events, Drag Events, etc
These have their own distinct properties, and they have an event target. We can read more about events in the MDN docs:
https://developer.mozilla.org/en-US/docs/Web/API/Event */

// There are multiple ways to add event listener to a HTML element. One way is to add an attribute that starts from on...
// We can use it but it is not recommended because we want a separation of concerns, and want control over what event listener we want

// Another method is to select the element and add an onclick property to a function
const button = document.querySelector('button');
const buttonClickhandler = () => {
    console.log('Hi there');
};
// button.onclick = buttonClickhandler;
// This is fine, until we want to add multiple handlers to a single button, or want to remove a listener.
// So the most preferred method is to use the addEventListener, which we can stack on top of each other, and remove with removeEventListener

// We can add an event listener like:
const boundButtonClickhandler = buttonClickhandler.bind(this);
button.addEventListener('click', boundButtonClickhandler);
// If we want to remove the event listener, maybe after 5 seconds, we can use the removeEventlistener
setTimeout(() => {
    button.removeEventListener('click', boundButtonClickhandler);
    // One thing we need to note is that we need to have the exact same function object reference in the second argument when doing this
    // So if we want to remove a listener at some point, we can't use an anonymous function because the reference would be different
    // Even for two identical anonymous functions

    // Also when we bind something to the function, it creates a brand new function object, so we need to store the bound function
    // And use the stored function while both adding and removing the event listener
}, 1000);

// We cann add another event listener as well
const anotherButtonClickHandler = (event) => {
    console.log(event);
    // We can see a lot of properties here, event.target is a property that lets us access the element that was clicked
    // We can set it to disabled
    // event.target.disabled = true;
};
// Here we have passed in an event parameter which will be sent as data when the event occurs. It is an object
// button.addEventListener('click', anotherButtonClickHandler);
// What if we have two buttons and we delegate the same handler to both of them, how would it know which button was clicked?
// The event.target property can let us select only the button we have clicked, so that we can disable it alone, and leave the other one
const bothButtons = document.querySelectorAll('button');
bothButtons.forEach((button) => {
    button.addEventListener('click', anotherButtonClickHandler);
});

// We don't only have the click event, but also other events like mouse over, scroll, etc
// Let's add a mouse over listener for one of the buttons
button.addEventListener('mouseenter', anotherButtonClickHandler);
// This is triggered when the mouse goes from one element to the button element. We also have a relatedElement property here
// This property has the previous element before the button, but it might not always be reliable, and sometimes gives html element itself
// when the mouse was moved too fast, as we can't poll for movement inifinite times per second

// Similarly, if we add a new section, we can add its height in css to a ludicrous amount so that we can scroll through it
// Then we can target that element and add a scroll event listener
const scrollableSection = document.getElementById('scrollable');
// scrollableSection.addEventListener('scroll', anotherButtonClickHandler);
// But we should be careful when using this beacuse it is logged many times per second for each scroll and may slow down our page

// Code to scroll infinitely:
/*
let curElementNumber = 0;

function scrollHandler() {
    const distanceToBottom = document.body.getBoundingClientRect().bottom;

    if (distanceToBottom < document.documentElement.clientHeight + 150) {
        const newDataElement = document.createElement('div');
        curElementNumber++;
        newDataElement.innerHTML = `<p>Element ${curElementNumber}</p>`;
        document.body.append(newDataElement);
    }
}

window.addEventListener('scroll', scrollHandler);
*/
// This was given in the course, and basically all it does is that when we're near the end, it creates a new div with some element number
// Then this div, which is huge, will take up more space and make it more scrollable

// When we have a form in the html, we have to take care of something
const form = document.querySelector('form');
// Normally the default behavior of a form is to refresh the page after clicking submit, but we may not want that to happen
// When the user presses submit, we might want to use JS to add some validation before we send the data to the server
// To do so we must prevent the default behavior of the form element. For that we can set an event listener to the form
form.addEventListener('submit', (event) => {
    // Normally almost all HTMLElements support almost all Events, but this 'submit' event is specific to forms
    // In tihs case, instead of using a property in event, we can use a method called preventDefault
    event.preventDefault();
    // This prevents the form from reloading and trying to take an action that we can specify
    console.log(event);
    // If we don't prevetn default, the event will get logged and then the page will be wiped clean
});

// Bubbling and Capturing
// In browser side Javascript, to handle events, the browser will look for any event listeners from outside to inside
// So if we have a nested element, then the outer element will be checked first, then the inside. This is called capturing the event
// Now for bubbling, the event listeners are executed from inside to outside. So if we have a listener on a button, and also
// one on the section containing the button, then the one on the button will be executed before the one on the section

// Now let's see this working hands on with the new-buttons div, and the first button inside it
const newBtnsDiv = document.getElementById('new-buttons');
newBtnsDiv.addEventListener('click', (event) => {
    console.log('DIV CLICKED');
    console.log(event);
});
// newBtnsDiv.addEventListener('click', () => {
//     console.log("DIV CLICKED");
// }, true);
// We can set another parameter apart from the event type and callback function to indicate that we want to execute on capture

const newBtnOne = newBtnsDiv.querySelector('button');
newBtnOne.addEventListener('click', (event) => {
    // The process of bubbling up and that one event can be handled by more than one elements is called propagation
    // When we handle the event on the desired element, we might not want to handle it with its ancestor
    // In such case we can use a method called stopPropagation
    event.stopPropagation();
    // It executes the event listener(s) on this element, but stops it from propagating upward further
    // We also have another method called stopImmediatePropagation, which stops even other event listeners after current one is executed

    console.log('BUTTON CLICKED');
    console.log(event);
});
// Not all events propagate upward though. For click it makes sense because we could have meant to click anything
// But when it comes to events like mouseenter, there is little point in bubbling the events
// We can know if an event bubbles or not with the event.bubbles property

// Now what if we have some list and we want to change the style when we click on a list item
// We can either select all the list items and add event listener to each of them using forEach
const allLis = document.querySelectorAll('li');
// allLis.forEach(li => {
//     li.addEventListener('click', () => {});
// })

// Or since we know that events propagate upward, we can select the entire list element and use event.target to find which element was clicked
const list = document.querySelector('ul');
list.addEventListener('click', function (event) {
    // event.target.classList.toggle('highlight');
    // We can use the event.target property to select what element was clicked, but our list element has more elements nested into it
    // So if we clicked on the h2, it will only target h2. Instead we need to target something else
    // event.currentTarget; can be used to select the element to which this event handler is attached
    // but since we don't want to style the entire list, we can use the DOM traversal method we learnt
    event.target.closest('li').classList.toggle('highlight');
    // This takes the target and finds the closest list item in its ancestry, and if target it li, then it will select itself
    // We can now click on any element in the list item and it will highlight the element completely

    // Apart from handling events, we can also induce them using JS
    // For example, we can submit the form ourselves when the list item is clicked by using
    // form.submit();
    // This is one of the actions which completely bypass the event listener when triggered
    // In order to be able to handle it with event listeners, we can use the click action
    button.click();
    // Now every time we click a list item, a button is also clicked

    // When we use an event listener by passing a normal callback function, the 'this' refers to the currentTarget
    // It means the element at which the event is handled, not necessarily the specific target of the event
    console.log(this);
    // Unless we override this by using bind() or other functions, or we use arrow functions which would return a window object here,
    // 'this' inside such an event handler would refer to the button
});

// Handling drag and drop using JavaScript
// Drag and Drop is not a normal HTML bahavior so we need to go through some steps to make it possilbe
// 1. Make the element draggable
// 2. For the element, listen to 'dragstart' event which initiates the dragging of the element
// 3. We can accept dropping to an element by setting that element's 'dragenter' and 'dragover' events. Since default browser behavior is to cancel,
// we need to also use event.preventDefault() when setting dragenter and dragover
// 4. We can also listen to the dragLeave event when we hover over some element then leave, useful for some UI
// 5. We can then listen to the 'drop' event on the destination element and using that we can update the UI and data
// 6. Finally we can also listen to the 'dragend' event on the dragged element and handle the success or failure accordingly

// I think this is it for today, will take care of the rest of today's topics tomorrow.
