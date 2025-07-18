class DOMHelper {
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

class Component {
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

class Tooltip extends Component {
    constructor(closeNotifierFunction, text, hostElementId) {
        super(hostElementId);
        this.closeNotifier = closeNotifierFunction;
        this.text = text;
        this.create();
    }

    closeTooltip = () => {
        this.detach();
        this.closeNotifier();
    };

    create() {
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'card';
        const tooltipTemplate = document.getElementById('tooltip');
        const tooltipBody = document.importNode(tooltipTemplate.content, true);
        tooltipBody.querySelector('p').textContent = this.text;
        tooltipElement.append(tooltipBody);

        const hostElPosLeft = this.hostElement.offsetLeft;
        const hostElPosTop = this.hostElement.offsetTop;
        const hostElHeight = this.hostElement.clientHeight;
        const parentElementScrolling = this.hostElement.parentElement.scrollTop;

        const x = hostElPosLeft + 20;
        const y = hostElPosTop + hostElHeight - parentElementScrolling - 10;

        tooltipElement.style.position = 'absolute';
        tooltipElement.style.left = x + 'px'; // 500px
        tooltipElement.style.top = y + 'px';

        tooltipElement.addEventListener('click', this.closeTooltip);
        this.element = tooltipElement;
    }
}

class ProjectItem {
    hasActiveTooltip = false;

    constructor(id, updateProjectListsFunction, type) {
        this.id = id;
        this.updateProjectListsHandler = updateProjectListsFunction;
        this.connectMoreInfoButton();
        this.connectSwitchButton(type);
        this.connectDrag();
    }

    showMoreInfoHandler() {
        if (this.hasActiveTooltip) {
            return;
        }
        const projectElement = document.getElementById(this.id);
        const tooltipText = projectElement.dataset.extraInfo;
        const tooltip = new Tooltip(
            () => {
                this.hasActiveTooltip = false;
            },
            tooltipText,
            this.id
        );
        tooltip.attach();
        this.hasActiveTooltip = true;
    }

    connectMoreInfoButton() {
        const projectItemElement = document.getElementById(this.id);
        const moreInfoBtn = projectItemElement.querySelector(
            'button:first-of-type'
        );
        moreInfoBtn.addEventListener(
            'click',
            this.showMoreInfoHandler.bind(this)
        );
    }

    connectSwitchButton(type) {
        const projectItemElement = document.getElementById(this.id);
        let switchBtn = projectItemElement.querySelector('button:last-of-type');
        switchBtn = DOMHelper.clearEventListeners(switchBtn);
        switchBtn.textContent = type === 'active' ? 'Finish' : 'Activate';
        switchBtn.addEventListener(
            'click',
            this.updateProjectListsHandler.bind(null, this.id)
        );
    }

    update(updateProjectListsFn, type) {
        this.updateProjectListsHandler = updateProjectListsFn;
        this.connectSwitchButton(type);
    }

    // In order to add the dragging functionality, we first need to add draggable="true" to all li elements
    // Then we can create a new function to connect the drag i.e. start the drag with some values
    // We then call this method inside the constructor function so that draggability is set up for the item
    connectDrag() {
        const item = document.getElementById(this.id);

        item.addEventListener('dragstart', (event) => {
            // For the dragstart event, we can set the data using dataTransfer method
            event.dataTransfer.setData('text/plain', this.id);
            // The data associated with the drag will be a plain text, we can also have html, and we're setting id
            // Available data types: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types
            // We can also add the effect while the dragging is happening, since we're moving we can set it to move
            event.dataTransfer.effectAllowed = 'move';
            // Different values available: https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/effectAllowed
        });

        // We can also add the dragend listener to the event and log out its event method
        item.addEventListener('dragend', (event) => {
            console.log(event);
            // It has target as the element that was dragged, because this listener is on the item
            // Also it has dropEffect property set to "move" when dropped on the list and not elsewhere
            // because we have only made the list droppable using drop listener
        });
    }
}

class ProjectList {
    projects = [];

    constructor(type) {
        this.type = type;
        const prjItems = document.querySelectorAll(`#${type}-projects li`);
        for (const prjItem of prjItems) {
            this.projects.push(
                new ProjectItem(
                    prjItem.id,
                    this.switchProject.bind(this),
                    this.type
                )
            );
        }
        console.log(this.projects);
        this.connectDroppable();
    }

    setSwitchHandlerFunction(switchHandlerFunction) {
        this.switchHandler = switchHandlerFunction;
    }

    addProject(project) {
        this.projects.push(project);
        DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
        project.update(this.switchProject.bind(this), this.type);
    }

    switchProject(projectId) {
        // const projectIndex = this.projects.findIndex(p => p.id === projectId);
        // this.projects.splice(projectIndex, 1);
        this.switchHandler(this.projects.find((p) => p.id === projectId));
        this.projects = this.projects.filter((p) => p.id !== projectId);
    }

    // Now that the project item is made draggable, we should also be able to drop it
    // But we're not dropping it inside another item, we're dropping it inside the list
    // So we need to connect a droppable property to the list
    // We can create a new method and add it in the constructor as well
    connectDroppable() {
        // Inside here we need to handle the dragend event, but also we can manipulate the styling
        // When we enter and leave a list we want to change the background color of the list
        // We can create a new class in the css and add it to the classlist of the list, and remove when left
        const list = document.querySelector(`#${this.type}-projects ul`);

        list.addEventListener('dragenter', (event) => {
            // If our html had more draggable elements, we would need to check for the type of drag event
            // Since we have set it to 'text/plain', we can use that. We can't access the value
            if (event.dataTransfer.types[0] === 'text/plain') {
                // In this case we need to add the class and prevent the default behavior
                list.classList.add('droppable');
                event.preventDefault();
            }
        });

        list.addEventListener('dragover', (event) => {
            // This is triggered when we're dragging over an item, we need to prevent default behavior as well
            if (event.dataTransfer.types[0] === 'text/plain') {
                // In this case we need to just prevent the default behavior
                event.preventDefault();
            }
        });

        list.addEventListener('dragleave', (event) => {
            // Now if we leave the list, we need to trigger change.
            // But leaving the list may mean entering a list item. So we need to check for the parent ul
            // And not change the style if the parent ul is still the same
            if (
                event.relatedTarget.closest(`#${this.type}-projects ul`) !==
                list
            ) {
                // In Firefox, apart from this, we also need to check if event.relatedTarget.closest exists
                // We can simply use event.relatedTarget.closest && ...
                list.classList.remove('droppable');
                event.preventDefault();
            }
        });

        // Finally to handle the drop behavior we need to handle the 'drop' event
        list.addEventListener('drop', (event) => {
            // In firefox we need to prevent the default behavior at the start because of how browser handles it

            // This is actually not that easy because we would need another interface between the available types
            // Let's first select the element to be dropped by getting the data that we had set at drag start
            const projectId = event.dataTransfer.getData('text/plain');
            // But we don't want to move it if it was dropped inside the list it was already on
            // So we need to avoid that case
            if (this.projects.find((p) => p.id === projectId)) {
                return;
            }
            // We can now simply click the button inside the current project item to move it
            // So we avoid having to write the drag move logic again
            document
                .getElementById(projectId)
                .querySelector('button:last-of-type')
                .click();
            // Finally we also need to remove the styling on the list it was dropped on
            list.classList.remove('droppable');
            // We can also optionally use the preventDefault here
            // event.preventDefault()
            // But in this case it is not useful, it would be useful if we had an image
            // which when dropped would by default open it in full screen
        });
    }
}

class App {
    static init() {
        const activeProjectsList = new ProjectList('active');
        const finishedProjectsList = new ProjectList('finished');
        activeProjectsList.setSwitchHandlerFunction(
            finishedProjectsList.addProject.bind(finishedProjectsList)
        );
        finishedProjectsList.setSwitchHandlerFunction(
            activeProjectsList.addProject.bind(activeProjectsList)
        );

        const timerId = setTimeout(this.startAnalytics, 3000);

        document
            .getElementById('stop-analytics-btn')
            .addEventListener('click', () => {
                clearTimeout(timerId);
            });
    }

    static startAnalytics() {
        const analyticsScript = document.createElement('script');
        analyticsScript.src = 'assets/scripts/analytics.js';
        analyticsScript.defer = true;
        document.head.append(analyticsScript);
    }
}

App.init();
