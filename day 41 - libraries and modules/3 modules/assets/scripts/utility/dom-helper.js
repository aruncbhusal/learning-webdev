// We need to export this as well

// We can also export each function separately and only import the ones we need, using the same method as before

export class DOMHelper {
    static clearEventListeners(element) {
        const clonedElement = element.cloneNode(true);
        element.replaceWith(clonedElement);
        return clonedElement;
    }

    static moveElement(elementId, newDestinationSelector) {
        const element = document.getElementById(elementId);
        const destinationElement = document.querySelector(
            newDestinationSelector
        );
        destinationElement.append(element);
        element.scrollIntoView({ behavior: 'smooth' });
    }
}
