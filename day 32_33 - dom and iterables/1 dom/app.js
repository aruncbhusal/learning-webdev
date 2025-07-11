/* The browser gets the HTML from the server and parses the document then renders it. During parsing it locates the JS scripts
It allows some Web APIs that allow the JavaScript code to access the parsed HTML document in an object form
This is called the DOM(Document Object Model), and there are other ways of parsing HTML as well, but this is what browsers use
*/

// Browser gives us a 'document' object which contains the entire html as a document object, whose properties we can see using
// The DOM is a part of the APIs exposed to us using the browser API or webAPI
console.dir(document);
// In fact document is not the top most object, but instead 'window' object contains the document.
// The window object has all the functions built in to the browser that we can call. We can call them as window.method() or method()
// eg. alert() is a method of the window object, but when the browser parses the code, it converts it to window.alert()
console.dir(window);

// The DOM is built of nodes, which form a DOM tree. This tree has element nodes, and text nodes, which are made of text/content
// The text nodes also exist as whitespaces in the document, such as line breaks and indentations.
// Inside the developer tools in the elements tab, when we click on an element, it selects the current node as $0
// We can then access the current node and log out as console.dir($0);

// Nodes are simply JS Objects which represent a component of the DOM. Nodes may be element nodes, text nodes, attribute nodes
// To get the first node that matches a condition, we can use querySelector(), getElementById() and they return a direct reference
// If we use querying methods like querySelectorAll(), getElementsByTagName(), .. they return a NodeList which is like an array
// querySelectorAll() returns a non-live NodeList i.e. a snapshot that doesn't reflect any addition/deletions

// We can use the following to select specific nodes
// document.body => Selects body
// document.head => Selects head
// document.documentElement => Selects the html element

// We can select the heading using the getElementById method, which is available on the document node, as well as other element nodes
console.log(document.getElementById('heading'));
// It takes the id as a string argument
// If no matches are found it returns null
// https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById
// We can also select the h1 by tagname, and it returns a NodeList as well
// https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName

// We can also store the result of the query inside a variable
const ul = document.querySelector('ul');
// https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
// Now we can make queries for the children of this node
for (node of ul.querySelectorAll('.list-item')) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
    console.log(node);
}

// We could instead use getElementByClassName for this, it is the same but an older method
// https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName

// Since we need to use css selectors inside the qeury selector methods, we can also use
console.log(document.querySelector('ul .list-item:first-of-type'));
// This selects the first element of the list
// There is also getElementsByName which works with a name attribute, but it isn't used very much
// Note: we can only query for element nodes

// We can manipulate the elements using JS. Let's first select the heading element here
const h1 = document.querySelector('h1');
// Now this node object has many properties. the className property has the class this element has, textContent has the text content,
console.log(h1.id);
console.log(h1.className);
console.log(h1.textContent);
// We can even modify it by setting these properties to some value
h1.className = 'headding-h1';
h1.textContent = 'A new heading';
// We also have another property called style which is an object with css styles. To see a DOM object for an element, we can visit MDN
h1.style.color = 'white';
h1.style.backgroundColor = 'black';
// We can see that the css property background-color is written as backgroundColor because we can't have - in variable names in JS

// Attributes vs properties
// Attributes are the describers of a html element, like the id is an attribute, class is an attribute, value is an attribute (for input)
// Properties are the actual properties of the DOM element. Not all the attributes in the html have a 1:1 correspondance with properties
// For example, id is both an attribute and a value, and a change with JS will be reflected in the DOM. So if I do:
h1.id = 'still_h1';
// Then this id will be shown in the html. The same is true for class, but its name as a property is className, and not class
h1.className = 'headinggg';
// This too will get reflected in the html, but what if I change the input field.
const input = document.querySelector('input');
input.value = 'some other text';
// We can see that this changes the actual value in the text field, but the value attribute is not updated
// We can also set the different attributes using setAttribute, and get them using getAttribute
input.setAttribute('value', 'other other text');
console.log(input.getAttribute('value'));
// We can see that the value attribute is updated, but the actual value inside the text field is still 'some other text'

// The querySelectorAll result is not synchronized to the DOM and it generates only a snapshot
// We can get the live updated node list using another selector like getElementByTagName, which too gives a NodeList
const allLis = document.getElementsByTagName('li');
console.log(allLis);
// Similar to arrays, we can also select elements by index here
console.log(allLis[1]);

// Traversing the DOM
// Once we select a node in the DOM, we have options to move. A node may have parent, ancestors, children, descendants and siblings
// A child is the direct child node/element of the current node. In the ul tag of this DOM, only li are the children
// Descendants include all children and children of children, so the li and em elements all are descendants
// Similar concept applies to the parent and ancestors as well. Parent is only direct parent and descendant are parent of parents
// We can access parent by using parentNode, parentElement or closest().
// The difference between parentNode and parentElement is that parentNode gives DOM Element Node, or others if parent
// But parentElement only returns the parent if it's an element node, else it returns null
// Similarly we can traverse children using childNodes, children or query methods, children selects element nodes only
// We can also select specific children using firstChild, firstElementChild, lastChild, lastElementChild
// Additionally, we can traverse to siblings using previousSibling, previousElementSibling, nextSibling and nextElementSibling

// Traversing through children
// What if we want a specific li element? If we want the second one, we can't use querySelector unless there's a unique selector for it
// We can get the ul element using the query selector, then we can use the traversal methods.
console.log(ul.children);
// This gives us a HTMLCollection which is an array like object. We can select ul.children[1] for the middle element
// If we instead use ul.childNodes it gives us all the nodes, text nodes and element nodes
// The text node is mostly the whitespaces and line breaks between the elements, which we can see using css property word-wrap: pre
// We can also use the firstElementChild and lastElementChild to access the first and last li elements
// Using firstChild and lastChild would give us the text node which might not be what we need

// Traversing parent
// Since a node can only have one parent, we can simply use parentNode or parentElement. In most cases they are the same
// Since only an element node can have a child node. But there is an exception. When using document.documentElement,
// parentElement is null because it is not a child of any elements, but parentNode is the entire #document object
// There also is a closest() method which lets us get to the nearest ancestor that satisfies the query
// In our case, we can use 'body' as a query to get the body element from the li element even though it is not its parent
console.log(allLis[1].closest('body'));

// Traversing siblings
// When using previousSibling and nextSibling, we most usually get text Node because of the gap between two elements with text
// We can use previousElementSibling and nextElementSibling to get the siblings. Let's get the siblings of the ul tag here
console.log(ul.previousElementSibling);
console.log(ul.nextElementSibling);

// Traversing the DOM vs Query
// We can nest the DOM traversal and chain them. If we want to select the first element child of next sibling of h1, we can do
console.log(document.querySelector('h1').nextElementSibling.firstElementChild);
// But this can be confusing, and if we add something after h1 and before the current sibling, the code will act in unintended ways
// We should use these tight traversals when we know the structure is not going to change
// Even though traversal is faster, we sometimes have to use query methods to make it work without fail

// Styling DOM elements
// There are two ways to style DOM elements: directly and indirectly
// We can simply select the style method and change the property there, this will add a style to the element directly (inline)
// Another method is to add a class which contains the required css properties in the css file
// We can do so in two ways: first using the className property for which we need to set it each time

// Say we have a button that when clicked will make the section visible/invisible, we can implement it as
const button = document.querySelector('button');
const section = document.querySelector('section');
button.addEventListener('click', () => {
    // if (section.className === 'bg-aqua visible') {
    //     section.className = 'bg-aqua invisible';
    // } else {
    //     section.className = 'bg-aqua visible';
    // }

    // Even though this works, we had to do a lot of work, checking for something then acting on it
    // But when more classes are added, it starts becoming more and more complex to add/remove classes this way
    // So we can instead use another way which is to use the classList property object
    // This object has methods like add(), remove() and toggle() which let us handle individual(or more) classes without affecting others
    // In this case the relevant method is toggle()
    section.classList.toggle('invisible');
    // Since it is visible by default even though we don't have the class set, we can use this. or we can set visible class manually before
});

// Adding elements to the DOM
// There are two ways to add HTML elements to the DOM: with HTML string or using createElement() method
// We can add the html string inside the innerHTML property for an element, which replaces current content with the HTML string passed
// Also we can use the insertAdjacentHTML() to add a html element next to the current element instead of replacing its content
// The other method creates the element using createElement, but to add we need other methods
// append and appendChild methods will add the element as a child to the node selected, it is placed at the end
// prepend, before, after, insertBefore are all methods that can be used to insert the element in other specific position
// replaceChild() and replaceWith() allow us to replace the children or the node itself with another created element

// Say we want to add a new list item to the list, we can use the innerHTML property which replaces all descendants
// We can simply add to the existing innerHTML
ul.innerHTML = ul.innerHTML + '<li>New element</li>';
// This works, but it reparses and rerenders the ul element. It may be fine in these small cases but in larger elements, we might lose data
// So we don't preere this. In order to add html string, we have a better method with insertAdjacentHtml which takes an argument
// we can see the values here: https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
const div = document.querySelector('div');
div.insertAdjacentHTML('beforeend', '<p>Some random text</p>');
// Now the element is added to the DOM without rerendering because we already tell this method what to add and where

// But this method doesn't give us direct access to the new element we just created, and we must again query for the element to get access
// So instead we can use the createElement method, which is always called fromt the document object. Then we can insert the object
const newLi = document.createElement('li');
// This creates a new element node of tagname li and stores it in newLi
// Now we can configure this blank li element and then append it as the child of the ul element
newLi.textContent = 'Yet another list element';
// The textContent property is used to add text content to an element
ul.appendChild(newLi);

// Inserting elements
// We have already used appendChild which is used to append a new child to the element, but we also have append()
// This method will append not only elements but also text nodes, so we can give a text parameter and it will add it as text node
// Also it can take multiple parameters. The case is similar with prepend, so let's try that for the div element we have
div.prepend('Just some prepended text');
// We can also use before() and after() to add elements before or after a node as siblings, but it is(was) not supported on Safari
// We can use them or instead use the insertAdjacentElement() method that takes the first parameter same as insertAdjacentHTML()
allLis[1].insertAdjacentElement('afterend', newLi);
// Since we're simply passing the references around, newLi node moves from one place to another when we insert it someplace else

// We can also clone a DOM node
const newLi2 = newLi.cloneNode(true);
// It takes an argument which when true clones the element along with all its descendants, but it false only copies the element
ul.lastElementChild.after(newLi2);

// Live Node List vs Static Node List
// When we use querySelectorAll we get a node list. Once we get it, any change that would be shown by a new query is not shown in original
// This is because it only takes a snapshot of the current DOM elements that satisfy the query.
// In contrast, the getElementsBy.. methods return a HTMLCollection which is updated with any update to the tracked elements

// In order to remove an element we have the remove method, we also have a removeChild method on a parent element
// So we can use domObject.parentElement.removeChild(domObject) or
newLi2.remove();

// I think this is it for today, not everything was covered, so I'll have to extend this to another day but it has been a long day so...
