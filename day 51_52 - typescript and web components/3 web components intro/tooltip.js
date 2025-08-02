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

        // this._toolTipComponent;
        this._toolTipIcon;
        this._toolTipVisible = false;
        // Since we want tool tip component to be private, we can simply define it here and use it inside another method
        this._toolTipText = 'Test text';
        // We can't access the attribute here because we can't work with the DOM inside the constructor so we need to do it in connectedCallback()

        // Currently the custom element we added is a part of the normal or "light" DOM, which is just us defining a component and giving it a name
        // But the component fully appears as a container with all the span and div we have inside appearing as a part of normal DOM tree
        // In this mode, the CSS and others in the normal DOM will affect elements inside this component too, but we can avoid that
        // By creating a shadow DOM and attaching elements to that shadow, we can have a DOM separate from normal DOM, as a part of this component
        this.attachShadow({ mode: 'open' });
        // We can also use the closed mode which closes this shadow DOM from outside accessing, so we can only access from this class that way

        // We can access the shadow root here, we can also access normal DOM, so let's get the template here and append it first
        // this.shadowRoot.appendChild(
        //     document.getElementById('tooltip-template').content.cloneNode(true)
        // );
        // With templates we can take advantage of something called 'slot' where any text node we might have is displayed
        // If we leave it empty, it will show whatever is there, but if we have some text inside slot, it will use it as the default value

        // But even better than having a template in the HTML, we can create a template here
        // By using innerHTML for the shadowRoot we can put the content of template into the root, to be rendered along with the element
        // Unlike appendChild it doesn't try to render immediately but only maps the value to the node so we are able to do so

        // In fact we can also add styles to the shadow DOM using the style tag, and this won't affect the DOM outside of this component
        // So we can comment out the styling in the tooltip, and use it here instead
        this.shadowRoot.innerHTML = `
            <style>
            :host{
                position: relative;
            }
            div {
                font-weight: normal;
                background-color: black;
                color: white;
                position: absolute;
                top: 1.5rem;
                left: 0.75rem;
                z-index: 10;
                padding: 0.15rem;
                border-radius: 3px;
                box-shadow: 1px 1px 6px rgba(0,0,0,0.26);
            }

            .highlight {
            background-color: black;
            }

            ::slotted(.highlight) {
                border-bottom-color: red;
                border-bottom-style: solid;
                border-bottom-width: 2px;
                background-color: var(--color-primary, #ccc);
                padding: 0.15rem;
            }

            .info {
                background-color: blue;
                color: white;
                border-radius: 50%;
                padding: 0.1rem 0.5rem;
            }

            :host(.important) {
                background-color: #ccc;
            }

            :hostContext(p) {
                font-weight: bold;
            }
            </style>
            <slot>Default slot value</slot>
            <span class="info">?</span>
        `;
        // When we do this, we can see in the DOM tree that the text node we have in the HTML is inside this tag, but it doesn't move into shadow DOM
        // It is a part of the normal DOM, and stays that way unless we get it here somehow. We can place it with slots but it doesn't exist inside
        // And this applies for any type of DOM node, not only text. We can wrap the text inside a span to see it
        // The implication of this is that when we apply styling to the light DOM, it applies to that node as well, but if we add here, it won't

        // But we can use a method to style any node slotted in the shadow DOM directly. So we can't select a descendent but can use single word selector
        // But the CSS in the light DOM will override the one in the shadow DOM

        // We can also style the elements inside our shadow DOM with normal CSS
        // And we can style the overall custom element by selecting the tag in the light DOM as well
        // Alongside that style, we can also style it from inside the shadow DOM using the :host selectot, though can be overridden
        // We can also choose whether to style it via the shadow DOM styling using a class that may be present on the custom component
        // We can make the conditional choice using :host as a function since :host.some-class doesn't work

        // We can also add another condition for the context where the component is located (i.e. where is it)
        // It is also a function selector called :hostContext which takes a tagname, which can be used readily

        // Since we want to maintain uniformity in styling, we can also set CSS variables that store certain values like color hex
        // We can set a primary color as a value by putting it inside ':root' selector or selecting 'html' and inside the CSS rule
        // We can place a property that begins with -- and then to use it, we can use var() where we can use the name, and we can give a fallback
        // value by separating with a comma
        // We can learn more about it here: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
    }

    // Let's work with our DOM and add an element into our component
    connectedCallback() {
        // const tooltipIcon = document.createElement('span');
        // tooltipIcon.textContent = '  (?)';
        // We can simply get the tooltip icon with a query now
        this._tooltipIcon = this.shadowRoot.querySelector('span');

        // Now to set the tooltip text we can check if an attribute is given, then if given we can use its value
        if (this.hasAttribute('text')) {
            this._toolTipText = this.getAttribute('text');
        }

        // this.style.position = 'relative';

        // We can add event listener to this tooltip icon so that the tooltip appears when we hover over it
        this._tooltipIcon.addEventListener(
            'mouseenter',
            this._showToolTip.bind(this)
        );
        // We call a private* method to handle the event, and we need to bind this because it is called by the element
        // Similarly we also need a mouseleave event handler
        this._tooltipIcon.addEventListener(
            'mouseleave',
            this._hideToolTip.bind(this)
        );
        // this.appendChild(tooltipIcon);
        // In order to add to the shadow DOM, we need to append it to the shadowRoot which is created when we attach a shadow to the DOM
        // this.shadowRoot.appendChild(tooltipIcon);
        // But right after doing so, the text node inside the shadow root is no longer displayed
        // In order to not have normal text inside the shadow node, we can also use templates instead of creating the element here
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
        // We were only reading the value from the text attribute to set the content of the tooltip while we were creating the component
        // But we also need to watch for changes, for that we need to add this function to the class which is passed three arguments
        // But before we can use it, we also need to watch for the attributes, since we don't want to be watching everything all the time
        // For that we can create a new static function with a get keyword and return an array of strings with attribute names
        // console.log(attribute, oldValue, newValue);

        // When a change is detected, we need to first check if the new value is still the same, in which case we don't waste performance
        if (newValue === oldValue) {
            return;
        }
        // But if it has changed, we need to know which attribute it is, since we may have multiple attributes being watched at the same time
        if (attribute === 'text') {
            this._toolTipText = newValue;
        }
    }

    static get observedAttributes() {
        return ['text'];
    }

    disconnectedCallback() {
        // When the element is removed from the DOM, it may have certain artifacts left, which may need to be cleaned up
        // In order to detect when the component is removed, we can have a disconnectedCallback function
        // These events may be some ongoing HTTP request, event listeners,etc
        // In our case, we have bound 'this' to our event listener callback passed, so we can't remove them straightforward
        // But since Browser auto garbage collects event listeners from a deleted element, it is redundant
        // But if binding was not done, we could use this:
        this._tooltipIcon.removeEventListener('mouseenter', this._showToolTip);
        this._tooltipIcon.removeEventListener('mouseleave', this._hideToolTip);
        // Just to be clear: This doesn't do anything for this particular case because of 'this' binding during adding of the listener
    }

    _render() {
        // When we have more complex components (this one is pretty simple), we may want to centralize the logic for rendering
        // That way we can have a better separation of logical concerns in the different methods, so we can just call this function
        // inside show and hide tooltip and we can change a variable to show or hide based on the method that is calling this method
        // We can have a tooltipVisible boolean that is true when _showToolTip is called, and false when _hideToolTip
        // We also don't need to have a class scoped toolTipComponent variable, we can simply have a local one
        // But that variable needs access to the tooltip component if already present, so that we can remove it
        let tooltipComponent = this.shadowRoot.querySelector('div');
        if (this._toolTipVisible) {
            tooltipComponent = document.createElement('div');
            tooltipComponent.textContent = this._toolTipText;
            this.shadowRoot.appendChild(tooltipComponent);
        } else {
            if (tooltipComponent) {
                tooltipComponent.remove();
            }
        }
    }

    // We can create the show tool tip method here which should only be accessible in the current class but since private properties
    // are not supported in older browsers, we use pseudo-private notation of _ before name to INDICATE that it is private
    _showToolTip() {
        // We want to create a tooltip component here but since we also need to remove that same component later,
        // we miight need to create a new property for this class that holds the tooltip component
        // this._toolTipComponent = document.createElement('div');
        // this._toolTipComponent.textContent = 'This is a tooltip';
        // But we don't want generic fixed tooltip text, we might want to be able to set it from the outside
        // For that we can use a property in this class, which we can set as a dummy value, and if we pass an attribute, we can update it
        // Then we can show the property in the text content of the component
        // this._toolTipComponent.textContent = this._toolTipText;

        // We can also add style to our component, for which we simply use the normal JS style object
        // this._toolTipComponent.style.backgroundColor = 'black';
        // this._toolTipComponent.style.color = 'white';
        // We also want this component to not disrupt the flow of elements so we want it to be positioned absolutely
        // For that we want the parent element i.e. this component to have a relative position which we can set while appending it to the DOM
        // this._toolTipComponent.style.position = 'absolute';
        // this._toolTipComponent.style.zIndex = 10;

        // this.appendChild(this._toolTipComponent);
        // this.shadowRoot.appendChild(this._toolTipComponent);

        // For usage with _render
        this._toolTipVisible = true;
        this._render();
    }

    _hideToolTip() {
        // this._toolTipComponent.remove();
        this._toolTipVisible = false;
        this._render();
    }
}

// In order to register this custom element for use, we need to use th customElements object which has a define method
// It takes two arguments, one for the name string for the element, which must be at least two words separated by dash
// It is >=2 words because we don't want to conflict with builtin HTML elements which are mostly one word
// And to not conflict with other libraries which might have similar components, we normally use identifier for the first word
customElements.define('acb-tooltip', Tooltip);
// Now we can add this to the HTML file to be able to use it

// This thing is going to take me one more day so it will go upto day 53 but I won't edit folder name else it will break past commit
// Yet again feeling sleepy so maybe going upto 54 but tomorrow I'll also update the readme so I'll be done by tomorrow
