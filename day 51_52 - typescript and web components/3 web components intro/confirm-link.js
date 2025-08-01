// Apart from creating our own custom autonomous element, we can also extend built-in html elements, like a link
// For this case we want to simply add an event listener that asks to confirm whether a user wants to leave a page
// We can also create a shadow DOM the same way as when creating a custom element but it isn't always necessary
// For this, we extend a particular html element
class Confirm extends HTMLAnchorElement {
    // Since the element is already in the HTML we don't need to have a constructor here, though we can have it if we need
    connectedCallback() {
        this.addEventListener('click', (event) => {
            if (!confirm('Are you sure you want to leave this page?')) {
                // The confirm function is built into the browser JS
                event.preventDefault();
            }
        });
    }
}

// Similarly we need to define the custom element but this time it takes a third argument, as to what it is extending, where we can give tagname
customElements.define('acb-confirm-link', Confirm, { extends: 'a' });
// And now when we want a link to use this, we can simply add an 'is' attribute to it with the name of the custom element
// We don't create a new element for this
