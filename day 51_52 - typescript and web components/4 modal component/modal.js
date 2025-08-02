// Here we'll create another custom component: a modal.
class Modal extends HTMLElement {
    constructor() {
        super();

        this.isOpen = false;

        this.attachShadow({ mode: 'open' });
        // We can add the modal and backdrop, and add some styling to the backdrop div
        // We want it to be dark, translucent, fixed and taking up the whoe window
        // The width 100% takes up the entire body, but height is not fixed to be equal to window height so we can set it to 100vh
        // Similarly, we can style the modal to appear at cneter by placing it fixed as well, left 25% and width 50%
        // We can then also set the height to be sufficient for the mdoal content, and we need to set a higher z index for modal
        // Also we want to add some content to the modal element so we add a header and two sections, one for the main content, a slot
        // and the other for the buttons that can be pressed by the user
        // We can style the entire modal using flexbox, and we can add additional styling to all individual elements as well
        // more on flexbox: https://academind.com/tutorials/flexbox-basics-container

        // Initially we want to hide the modal and backdrop, for that we have multiple options, setting display: none, opacity, etc
        // Here we'll use opacity: 0 and pointer-events: none so that the clicks made on the button pass through the modal and backdrop
        // Because even if we have 0 opacity, the elements are still there and might block any clicks
        // We can also add animation by sliding it up and down and changing opacity with transition: all....
        // More on transition: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions/Using_CSS_transitions
        this.shadowRoot.innerHTML = `
        <style>
            :host([opened]) #backdrop,
            :host([opened]) #modal {
                opacity: 1;
                pointer-events: all;
            }
            
            :host([opened]) #modal {
                top: 15vh;
            }

            #backdrop {
                background-color: rgba(0,0,0,0.75);
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                z-index: 10;
                opacity: 0;
                pointer-events: none;
            }

            #modal {
                position: fixed;
                top: 10vh;
                left: 25%;
                width: 50%;
                z-index: 100;
                background: white;
                border-radius: 3px;
                box-shadow: 0px 2px 8px rgba(0,0,0,0.26);
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                opacity: 0;
                pointer-events: none;
                transition: all 0.3s ease-out;
            }
            
            header {
                padding: 1rem;
                border-bottom: 1px solid #ccc;
            }

            header h1 {
                font-size: 1.25rem;
            }

            ::slotted(h1) {
                font-size: 1.25rem;
                margin: 0;
            }

            #main {
                padding: 1rem;
            }

            #actions {
                border-top: 1px solid #ccc;
                padding: 1rem;
                display: flex;
                justify-content: flex-end;
            }

            #actions button {            
                padding: 0.25rem;
                margin: 0 0.25rem;
                border-radius: 2px;
                border-width: 2px;
                box-shadow: 0px 2px 4px rgba(0,0,0,0.26);
            }
            #actions button:hover{
                background: #ccc;
                cursor: pointer;
            }
        </style>
        <div id='backdrop'></div>
        <div id='modal'>
            <header>
                <slot name="title">Please Confirm!</slot>
            </header>

            <section id="main">
                <slot></slot>
            </section>

            <section id="actions">
                <button id="cancel-btn">Cancel</button>
                <button id="confirm-btn">Done</button>
            </section>
        </div>
        `;
        // If we wanted the header h1 to be changeable we have an option to pass it as a value of an attribute
        // Another way is to use slots, but we need to know what content goes into which slot since we already have a slot inside main
        // We can add a name attribute to the slot and then add a slot attribute in the light DOM to assign it to the slot
        // If we don't give a name attribute, all the rest of the slotted elememts are bundled into that slot
        // Then when using slot, we can't target h1 directly in css from the shadow DOM and we have to instead use ::slotted(h1)

        // We can also access the elements/nodes passed into the slot
        const slots = this.shadowRoot.querySelectorAll('slot');
        slots[1].addEventListener('slotchange', () => {
            // When the element is added to the slot, the slotchange event is triggered, at least once when it is first rendered
            // Here we can display the node dir of the assigned nodes of the slot
            console.dir(slots[1].assignedNodes());
            // For each node, we can see its assigned node and a lot of other properties as a part of the slot inside the shadow DOM
        });

        // Now we need to be able to close the modal when we press a button so we can select the buttons here
        const cancelBtn = this.shadowRoot.querySelector('#cancel-btn');
        const confirmBtn = this.shadowRoot.querySelector('#confirm-btn');
        // We can add an event listener to both of these, they should do their own actions, since we don't want redundancy
        cancelBtn.addEventListener('click', this._cancel.bind(this));
        confirmBtn.addEventListener('click', this._confirm.bind(this));
        // Similarly we can also add a click listener on the backdrop to close the modal
        const backdrop = this.shadowRoot.querySelector('#backdrop');
        backdrop.addEventListener('click', this._cancel.bind(this));
    }

    // Now to make the modal visible, a possible approach is to watch out for the opened attribute being added
    attributeChangedCallback(name, oldValue, newValue) {
        // if (name === 'opened') {
        //     if (this.hasAttribute('opened')) {
        //         this.shadowRoot.querySelector('#backdrop').style.opacity = 1;
        //         this.shadowRoot.querySelector('#backdrop').style.pointerEvents = 'all';
        //         this.shadowRoot.querySelector('#modal').style.opacity = 1;
        //         this.shadowRoot.querySelector('#modal').style.pointerEvents = 'all';
        //     }
        // }

        if (this.hasAttribute('opened')) {
            this.isOpen = true;
        } else {
            this.isOpen = false;
        }
    }

    static get observedAttributes() {
        return ['opened'];
    }
    // This is a valid way of doing this, but since we're only dealing with styling, we can use the CSS itself to deal with this
    // with the help of attribute selectors, we can change the CSS properties of backdrop and modal elements if host has opened attribute

    open() {
        // We want this to be able to be clicked from the outside as well
        // Inside here we can set the attribute of the root, or we can set a class-scoped variable
        this.setAttribute('opened', '');
        // When we set this attribute, if it is already opened, we can deal with the rest using attributeChangedCallback
        // this.isOpen = true;
    }

    close() {
        // This method should be called from both cancel and confirm methods
        this.removeAttribute('opened');
        this.isOpen = false;
    }

    _cancel(event) {
        this.close();

        // Apart from closing, we can also dispatch a custom event, for which we can create a new Event object
        // const cancelEvent = new Event('cancel');
        // Normally the event we create will not bubble up, and events created inside shadow DOM will not leave the shadow DOM
        // But we can add an optional argument to the Event constructor so that we can access it in the light DOM and bubble it as well
        const cancelEvent = new Event('cancel', {
            bubbles: true,
            composed: true,
        });

        // To dispatch an event on an element, we can use dispatchEvent
        event.target.dispatchEvent(cancelEvent);
        // But here the event is dispatched to the same button where the cancel was pressed, we can capture it again but that's no use here
    }

    _confirm() {
        this.close();

        // But we don't need to dispatch event on the target only, we can simply dispatch the event on this whole element
        // That way we can handle it with the listener we already have in the script
        const confirmEvent = new Event('confirm');
        // This too will not bubble by default so it is only accessible where we dispatch it
        this.dispatchEvent(confirmEvent);
    }
}

customElements.define('acb-modal', Modal);

// This appears to be the final module of the course so looks like i've done it, regardless of how many days it took
// I expected to complete this 4 days ago but here I am, this was a bit longer than I had initially expected, but it's all good
// For further reading from Max, here's some references:
// https://academind.com/tutorials
// https://academind.com/courses
