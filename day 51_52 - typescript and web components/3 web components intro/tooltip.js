// We can create our own autonomous custom component here
// For that we need to create a class that extends the HTMLElement class
class Tooltip extends HTMLElement {
    constructor() {
        // As for any class that inherits, we need to call the constructor of base class using super
        super();
        // Now we can write the code for the component, we can also use normal statements
        // console.log('It is working!');

        // We can also enclose some html content inside our custom element and do something with it
        // const tooltipText = document.createElement('span');
        // tooltipText.textContent = '  (?)';

        // But we cannot append this element to the custom element here
        // This is because the components go through a lifecycle defined by the browser.
        // First the constructor is executed where the element is defined in memory, with attributes, properties, etc
        // Then the browser automatically executes a connectedCallback method after the element is added to the DOM
        // We also have disconnectedCallback for when the node is destroyed, for example, so that we can do cleanup
        // Further, there's a attributeChangedCallback which allows us to update data and the DOM in response to change in attributes

        this._toolTipComponent;
        // Since we want tool tip component to be private, we can simply define it here and use it inside another method
        this._toolTipText = 'Test text';
        // We can't access the attribute here because we can't work with the DOM inside the constructor so we need to do it in connectedCallback()
    }

    // Let's work with our DOM and add an element into our component
    connectedCallback() {
        const tooltipIcon = document.createElement('span');
        tooltipIcon.textContent = '  (?)';

        // Now to set the tooltip text we can check if an attribute is given, then if given we can use its value
        if (this.hasAttribute('text')) {
            this._toolTipText = this.getAttribute('text');
        }

        this.style.position = 'relative';

        // We can add event listener to this tooltip icon so that the tooltip appears when we hover over it
        tooltipIcon.addEventListener(
            'mouseenter',
            this._showToolTip.bind(this)
        );
        // We call a private* method to handle the event, and we need to bind this because it is called by the element
        // Similarly we also need a mouseleave event handler
        tooltipIcon.addEventListener(
            'mouseleave',
            this._hideToolTip.bind(this)
        );
        this.appendChild(tooltipIcon);
    }

    // We can create the show tool tip method here which should only be accessible in the current class but since private properties
    // are not supported in older browsers, we use pseudo-private notation of _ before name to INDICATE that it is private
    _showToolTip() {
        // We want to create a tooltip component here but since we also need to remove that same component later,
        // we miight need to create a new property for this class that holds the tooltip component
        this._toolTipComponent = document.createElement('div');
        // this._toolTipComponent.textContent = 'This is a tooltip';
        // But we don't want generic fixed tooltip text, we might want to be able to set it from the outside
        // For that we can use a property in this class, which we can set as a dummy value, and if we pass an attribute, we can update it
        // Then we can show the property in the text content of the component
        this._toolTipComponent.textContent = this._toolTipText;

        // We can also add style to our component, for which we simply use the normal JS style object
        this._toolTipComponent.style.backgroundColor = 'black';
        this._toolTipComponent.style.color = 'white';
        // We also want this component to not disrupt the flow of elements so we want it to be positioned absolutely
        // For that we want the parent element i.e. this component to have a relative position which we can set while appending it to the DOM
        this._toolTipComponent.style.position = 'absolute';

        this.appendChild(this._toolTipComponent);
    }

    _hideToolTip() {
        this._toolTipComponent.remove();
    }
}

// In order to register this custom element for use, we need to use th customElements object which has a define method
// It takes two arguments, one for the name string for the element, which must be at least two words separated by dash
// It is >=2 words because we don't want to conflict with builtin HTML elements which are mostly one word
// And to not conflict with other libraries which might have similar components, we normally use identifier for the first word
customElements.define('acb-tooltip', Tooltip);
// Now we can add this to the HTML file to be able to use it

// This thing is going to take me one more day so it will go upto day 53 but I won't edit folder name else it will break past commit
