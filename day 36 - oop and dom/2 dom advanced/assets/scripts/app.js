/* This file was given to us as a complete working oop practice code. Now we need to implement more into it */

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

        // After the element is appended we might want to scroll to it. There are a few ways to scroll using JS
        // It works when the element is scrollable, in this case destinationElement is
        // We can use the scrollTo method and pass in x and y which will scroll to a certain co ordinate
        // We can also use scrollBy which will scroll relative to current scroll position
        // This means executing same scrollTo twice will scroll once max, but scrollBy can scroll twice if we're not at max scroll
        // scrollto can also take an object where we can specify left, top, etc, and we can also define a behavior
        // The behavior is useful because normally scrolling happens instantaneously, but we can set it to 'smooth' for an animation like effect

        // But in this case we have an even better method to scroll so that the newly moved element comes into view
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
        // We now also have a text parameter, which we can save
        super(hostElementId);
        // Since we want to render it around the host element, we can pass in the host element id
        // Then we also need to pass the hostElement to this class so that we can pass it to super
        this.text = text;
        this.closeNotifier = closeNotifierFunction;
        this.create();
    }

    closeTooltip = () => {
        this.detach();
        this.closeNotifier();
    };

    create() {
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'card';
        // tooltipElement.textContent = this.text;
        // We might want to instead have html, not just the text, but we should not be writing html inside JS
        // Though we can write innerHTML here, it is better to set up a <template> tag inside the html, which is not rendered but is part of DOM
        // Inside the template tag, we can have some HTML that we may want to reuse using JS
        // In order to access that template, we can set an id and get the element here
        const templateElement = document.getElementById('tooltip-template');
        // Now we can get the contents of this template element by using import node and setting subtree parameter to true
        const templateContent = document.importNode(
            templateElement.content,
            true
        );
        // Now we can change this template's content using what we already know
        templateContent.querySelector('p').textContent = this.text;
        // Finally we can append this content to the tooltip element div
        tooltipElement.append(templateContent);

        // Now we have a hostElement in the base class so we can use it here to get the info
        // console.log(this.hostElement.getBoundingClientRect());

        // Let's now position the tooltip before placing it. We can first get all the values about the hostElement so we can place accordingly
        const hostPosLeft = this.hostElement.offsetLeft;
        const hostPosTop = this.hostElement.offsetTop;
        const hostHeight = this.hostElement.clientHeight;
        // We also need to find the amount we have scrolled so that we can position tooltip correctly, else we place it where content should be pre scroll
        const hostScroll = this.hostElement.parentElement.scrollTop;
        // But we want the scroll of the container, we haven't scrolled on the host Element but the div

        // based on these information we can now find the x and y offset of the tooltip respective to the host element
        const x = hostPosLeft + 20;
        const y = hostPosTop + hostHeight - hostScroll - 10;
        // We had to add the host height as well because we want to render it below the host but in line with host position from left

        // Finally we use x and y to set the top and left css properties of the tooltip because we need to work with style here
        // Normally the positions are relative to the document, so we need to also use absolute positioning for this to work
        tooltipElement.style.position = 'absolute';
        tooltipElement.style.left = x + 'px'; // Since we must give a unit, and we need it in string format
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
    }

    showMoreInfoHandler() {
        if (this.hasActiveTooltip) {
            return;
        }
        // In order to create a tooltip, we also need to send in some data I want to display inside the tooltip
        // Our html already has some attributes called data-extra-info, data- attributes can be set ourselves to use as data for an element
        // We can have as many of those attributes as we want, and their appear in camelCase in JS i.e. extra-info becomes extraInfo
        // We can access these using the .dataset property of the dom node which holds a dataset map with all attributes
        const curElem = document.getElementById(this.id);
        const tooltipText = curElem.dataset.extraInfo;
        // We can also  create our own data- properties for the node here and it would be reflected in the html
        // Now we can send this text variable over so that we can display inside the tooltip class

        const tooltip = new Tooltip(
            () => {
                this.hasActiveTooltip = false;
            },
            tooltipText,
            curElem.id
        );
        // We need to also pass the tooltip id
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
        // We also need to bind the 'this' so that it knows what 'this' actually is
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

        // Here we can add an event listener to the button that can be used to add the new script
        // document
        //     .getElementById('script-loader')
        //     .addEventListener('click', this.addScript);
        // This is good to know but we should always be careful when adding scripts to our document later
        // we should not give the user the ability to define their own scripts, and we should sanitize user inputs to avoid XSS

        // The browser also has other features, like setting a Timer using the setTimeout function
        // It is a method of window but we can use it directly, and it accepts three parameters: a function to execute after timeout expires
        // the time in milliseconds after which the function is to be executed, and an array with parameters to be passed to the function
        // This is an example of asynchronous behavior because when we set a timeout, it doesn't stop our code execution
        // It sets a timer on the browser and after the time, it executes the function without stopping any normal execution
        const timeoutId = setTimeout(this.addScript, 2000);
        // We're storing it in a variable because we want to be able to turn it off when we click the button
        document
            .getElementById('stop-script-loader')
            .addEventListener('click', () => {
                clearTimeout(timeoutId);
            });
        // Similarly, we can also use setInterval to execute a code in a certain interval (in the later.js file)
    }

    // We can also add scripts using JavaScript. We can create a script element and append it
    static addScript() {
        const scriptTag = document.createElement('script');
        // Now if we have a different file we want to load when a certain action happens, we can add an event listener and call this function
        // Here we can now modify the src attribute of this script tag so that the script runs
        scriptTag.src = './assets/scripts/later.js';
        document.head.append(scriptTag);
    }
}

App.init();
