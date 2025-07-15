// We have sizes.html from which we can take a DOM element, let's take the main div, we can use
const mainElement = document.getElementById('main-box');
console.log(mainElement.getBoundingClientRect());
// This method is used to give generalized data about the DOM element.
// Some of the things it includes are: top, left: which define how far from the window border does the element begin
// There are also height and width propterties for the node. Finally, x and y, which are similar to left and top

// We also have other specific properties
console.log(mainElement.offsetLeft);
console.log(mainElement.offsetTop);
// These are distances from the start of the document to the top and left of this dom element
console.log(mainElement.clientLeft);
console.log(mainElement.clientTop);
// These are distances from the element box to the content i.e. border and scrollbar
console.log(mainElement.offsetWidth);
console.log(mainElement.offsetHeight);
// Entire width and height of the box, including borders and scrollbars
console.log(mainElement.clientWidth);
console.log(mainElement.clientHeight);
// Width and height of the box excluding borders and scrollbars
console.log(mainElement.scrollHeight);
// Total height of the element which when scrolling we should pass
console.log(mainElement.scrollTop);
// Current scroll distance from the top of the element

// Now there are some other methods which can be used
console.log(window.innerWidth);
console.log(window.innerHeight);
// These give the width and height of the window including scrollbars, but sometimes when we want to design only visible parts
// We need to exclude them, in such case we can instead use
console.log(document.documentElement.clientWidth);
console.log(document.documentElement.clientHeight);

// We can see the elements here: https://developer.mozilla.org/en-US/docs/Web/API/Element
// All HTML Elements have a HTMLElement prototype, these have Element prototype, each Element has Node prototype, each Node has EventTarget prototype
