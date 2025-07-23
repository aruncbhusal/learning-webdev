export class Modal {
    constructor(contentId, fallbackText) {
        this.fallbackText = fallbackText;
        // Here we need to select the templates we have. We can select the template that contains the backdrop and the modal
        this.modalTemplate = document.getElementById('modal-template');
        // And we can take argument for the other template, in which we can pass content inside the modal, like loading screen
        this.modalContent = document.getElementById(contentId);
    }

    show() {
        // In this function we need to ensure the modal is appended into the body, but before that we need to confirm we can use template
        // <template> tag isn't supported by older IE, so we can simply check for a key inside the modalTemplate DOM Object to know
        if ('content' in this.modalTemplate) {
            const modalElements = document.importNode(
                this.modalTemplate.content,
                true
            );
            // This gets the entire template's content into modalElements, from which we can get backdrop and modal individually
            this.modal = modalElements.querySelector('.modal');
            this.backdrop = modalElements.querySelector('.backdrop');

            // We need to add the loading screen inside modal
            const content = document.importNode(
                this.modalContent.content,
                true
            );
            this.modal.append(content);

            // Finally we need to add this to the page
            document.body.insertAdjacentElement('afterbegin', this.modal);
            document.body.insertAdjacentElement('afterbegin', this.backdrop);
            // First we add modal at the top of body, then we add backdrop on top of that so it doesn't cover the modal (i.e behind)
        } else {
            // If the option isn't available, we can set a fallback text to be shown by accepting as parameter
            alert(this.fallbackText);
        }
    }

    hide() {
        // I want to take this one as an exercise instead of a tutorial
        // const modal = document.querySelector('.modal');
        // if (modal) modal.remove();
        // const backdrop = document.querySelector('.backdrop');
        // if (backdrop) backdrop.remove();

        // In the course, the modal and backdrop elements we created during show were first converted into class wide scope
        // Then we could set them to null here so that the references to DOM elements would be removed
        if (this.modal) {
            document.body.removeChild(this.modal);
            document.body.removeChild(this.backdrop);

            this.modal = null;
            this.backdrop = null;
        }
    }
}
// Now we need to add this inside the other js files in the right places
