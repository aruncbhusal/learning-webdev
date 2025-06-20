/* In this first challenge, we have to select the third <li> inside the index.html and change its text to something else
            I will have to stick to the way it was taught in the course, because that is what I'm basing the learning on for now */
var thirdLi =
    document.firstElementChild.lastElementChild.firstElementChild
        .lastElementChild.lastElementChild;
//I had to add a conainer div just to make this format work
// and also this is the solution used in the course, just that it was executed in the console so didn't need the wrapper div
console.log(thirdLi);
// Instead of this, I can also use something else we've got a glimpse of already
thirdLi = document.querySelector('ul').lastElementChild;
console.log(thirdLi);
// Now I can edit its content to something else
thirdLi.innerHTML = 'Half Life Thre.. noooo';

// Other ways to select an element are:
var button = document.getElementsByTagName('button');
// This line gets the unordered list element by using the tag name i.e. button and it gives us a list, even if there is only one element
console.log(button);
// Since it is a list, we can't access it directly and must use the index to access the first element
button[0].innerHTML = 'Click Here';

// Instead of a tag name, we can also grab elements by their class name
var listItems = document.getElementsByClassName('list');
// This too gives us an array because of the "Elements", and if we want to change the text color for the last list item
listItems[2].style.color = 'purple';

// We can also use a tag to get an element from the DOM
var title = document.getElementById('title');
// This one returns a single element instead of an array, because tag is unique and only one element inside the document can have it
title.innerHTML = 'Hiya';

// Finally, back to the querySelector, we can use it with the selectors we used with CSS to select the element
var linkInside = document.querySelector('ul a');
// This selects the link inside the unordered list
console.log(linkInside);

// But querySelector only returns a single element, what if there are multiple elements that match the selector?
// In such a case it returns only the first one which satisfied the selector. In order to get a list of all elements:
var allListItems = document.querySelectorAll('li.list');
// This selects all the list items that also have the class set to list. This is an array whose length we can see
console.log(allListItems.length);
allListItems[1].innerHTML = 'The sequel';

/* Now we have a challenge, we need to change the color of the anchor tag inside the ul, we can select it in various ways */
console.log(
    document.getElementsByTagName('ul')[0].firstElementChild.firstElementChild
);
console.log(document.getElementsByClassName('list')[0].firstElementChild);
console.log(document.querySelector('.list a'));
// But since we've already selected it as linkInside above, we'll use that here
linkInside.style.color = 'green';

// CSS Manipulation Using JavaSript
/* We can change the style of an HTML element using JavaScript, the names of properties are a bit different
             In Javascript, the property names like font-size become fontSize due to camel casing, and values must be assigned as strings 
             Our challenge is to set the background color for the button to yellow */
document.querySelector('button').style.backgroundColor = 'yellow';

// Separation of Concerns: HTML for content, CSS for style, JavaScript for behavior
/* Instead of changing the style using JavaScript, we should instead let the CSS handle it. Since we want to add behavior, we can do something else
HTML objects have a property called classlist which contains a list of all the classes applied to that element */
console.log(listItems[1].classList);
// We can add or remove classes from this list. Let's create a style with visibility: hidden; If we add this class to an item, it is invisible
listItems[1].classList.add('invisible'); // This adds the invisible class to the element
listItems[1].classList.remove('invisible'); // This removes the invisible class from the element
listItems[1].classList.toggle('invisible'); // This adds if not present and removes if already present
listItems[1].classList.toggle('invisible'); // This adds if not present and removes if already present

/* The challenge here is to add the huge class to the title to make it large. We can do */
document.getElementById('title').classList.add('huge');

// Text Content and HTML Manipulation
/* When using the innerHTMl, we can not only change the text but also the entire html content inside the element.
We can instead use the textContent property to only change the text content of the element.
For example, let's take the first list item whose innerHTML contains the anchor tag, but the text content is just "Google"
We can change it to "Not Google" by changing the text content of the link itself */
linkInside.textContent = 'Not Google';

// But in the case we want to change the enire html content, we can instead use the innerHTML. What if we want to emphasize the second list item
allListItems[1].innerHTML = '<em>This text must be emphasized</em>';
// Something to note is that everything is inside quotes and treated as a string, else it is treated as a JS code, which it is not.

// Manipulating element attributes
/* Anything inside a tag apart from the tag name is an attribute. We can see the attributes in a tag using the attributes property. We can also get the value of an individual attribute using the getAttribute method, and we can also set the value of an attribute using the setAttribute meethod */
console.log(document.querySelector('a').attributes);
console.log(document.querySelector('a').getAttribute('href'));
document.querySelector('a').setAttribute('href', 'https://www.youtube.com');
/* In the lines above we can see that the getAttribute property has a single input, the name of the attribute
The setAttribute takes two values, one for the attribute name, and the other for the value we need to set. Both must be strings. */
