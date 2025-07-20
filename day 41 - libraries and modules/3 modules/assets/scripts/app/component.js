// Since other classes in different files depend on this file, we need to make it available
// In order to do so, we can use a special keyword 'export' before the class definition to ensure it is exported here
// For this to work, we need to also add a type="module" to the actual app file which will work with all dependencies in the end
// We can export variables, objects, anything and are not limited to classes

// When we have a single export in a file, it is common to add another keyword called default in the function declaration
// This specifies the main thing we want to export from the file. We can also have normal "named" imports alongside a default one
// There can only be one default export in a file

export default class Component {
    constructor(hostElementId, insertBefore = false) {
        if (hostElementId) {
            this.hostElement = document.getElementById(hostElementId);
        } else {
            this.hostElement = document.body;
        }
        this.insertBefore = insertBefore;
    }

    detach() {
        if (this.element) {
            this.element.remove();
            // this.element.parentElement.removeChild(this.element);
        }
    }

    attach() {
        this.hostElement.insertAdjacentElement(
            this.insertBefore ? 'afterbegin' : 'beforeend',
            this.element
        );
    }
}
