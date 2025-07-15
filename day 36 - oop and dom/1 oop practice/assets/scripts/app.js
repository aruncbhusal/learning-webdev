/* In this one we're working from scratch in an application where we need to implement a project planner
The elements and projects are all in the html, and we need to add behavior to them, namely moving a project from active to finished
We have two list of projects, and each project has a tooltip when we click 'More info'
I'm not quite sure what I'd do from scratch so instead I'll try to implement like was done in the course
But then again this is a practice module so I'll try each feature first then compare that specific feature once done
Rather than completing the project completely from scratch
I think we need to first start by defining a few classes since we'll be dealing with OOP
The classes I can think outright are a project item, project list, the main app but I got more from the course: the tooltip */

// To move the element from one list to another this, we can set up a helper class with static methods
class DOMHelper {
    static moveElement(elementId, destinationSelector) {
        // We need to know what to move, and where to move
        const element = document.getElementById(elementId);
        const destination = document.querySelector(destinationSelector);
        destination.append(element);
    }

    static refreshNode(element) {
        const clone = element.cloneNode(true); // this creates a deep copy
        element.replaceWith(clone);

        return clone;
    }
}

// Now we can add inheritance to this, by making the attach and detach functions stem from a base class
class Component {
    // We can also define a constructor that sets up the destination to append, and whether to append at first or last
    constructor(parentElId, insertBefore = false) {
        this.parentEl = parentElId
            ? document.getElementById(parentElId)
            : document.body;
        this.insertBefore = insertBefore;
    }
    detach() {
        // In this function we should remove the element
        this.element.remove();
    }
    attach() {
        // We should now insert into the parentEl
        this.parentEl.insertAdjacentElement(
            this.insertBefore ? 'afterbegin' : 'beforeend',
            this.element
        );
    }
}

class ToolTip extends Component {
    constructor(closeCheck) {
        super(null, true); // We can chose to not pass anything and it would add the tooltip after the lists
        this.closeCheck = closeCheck;
        this.create();
    }

    // Inside this class we will have a method to attach tooltip, detach it(close it)
    closeTooltip = () => {
        // We're using an anonymous field function here because we need to call it using an event listener
        this.detach();
        this.closeCheck();
    };
    create() {
        // Here we will handle everything from creation of the tooltip to adding event listener to detach it
        const ttElement = document.createElement('div');
        ttElement.className = 'card'; // Was already given in the css
        ttElement.textContent = 'This is a tooltip';
        ttElement.addEventListener('click', this.closeTooltip);
        // Since we're going to call an arrow function through the event listener, we don't need to bind anything
        this.element = ttElement; // So that we can refer to the element in detach function
        this.attach();
    }
}

class ProjectItem {
    hasActiveTooltip = false;

    constructor(pid, switchHandler, type) {
        // Similarly we need to call the projectList's switch function from  here
        // But since it doesn't rely on anything other than the list it is in, we can simply pass it as a parameter
        // while creating this object, i.e. in the constructor
        this.switchProject = switchHandler;

        // We have passed the project id, now we can load the project item
        // We also store the id as a property of this object
        this.id = pid;

        // const project = document.getElementById(pid);
        // console.log(project);
        // The project node is needed when we're setting event listeners for the tooltip and switch actions
        // So let's create methods and call them here that will add the event listeners
        this.setupToolTipBtn();
        this.setupSwitchBtn(type);
    }

    showMoreInfoHandler() {
        // We don't want to attach a new tooltip if the tooltip already exists, so we will create a new property to check that
        if (this.hasActiveTooltip) {
            return;
        }

        // Now we need to also add the tooltip, so let's create the tooltip and call a function to attach it
        new ToolTip(() => {
            this.hasActiveTooltip = false;
        });
        // We also want to turn it false when detach is pressed so we need to pass a function that can set it to false
        // tooltip.attach();
        // We don't need to store the variable since we do attaching inside the constructor
        this.hasActiveTooltip = true;
    }

    setupToolTipBtn() {
        // Here we'll need to get the tooltip button and add an event handler i.e. showMoreInfoHandler
        const projectElement = document.getElementById(`${this.id}`);
        const moreInfoBtn =
            projectElement.querySelector(`button:first-of-type`);
        moreInfoBtn.addEventListener('click', this.showMoreInfoHandler);
    }

    setupSwitchBtn(type) {
        // We need to select the button here
        const projectElement = document.getElementById(`${this.id}`);
        let projectSwitchBtn =
            projectElement.querySelector(`button:last-of-type`);
        // Now for the callback of this function we will need to call the project list as it handles the lists
        // We need to take this item and remove from one list and add to another

        // But the button already has an event listener, so to remove it we need to first clone the node and replace it
        // we can do it by creating and calling a helper function inside the DOMHelper class
        projectSwitchBtn = DOMHelper.refreshNode(projectSwitchBtn);

        // We had to pass the type passed while constructing and updating so that we could update the button
        projectSwitchBtn.textContent =
            type === 'active' ? 'Finish' : 'Activate';

        // Then we can finally add a new one
        projectSwitchBtn.addEventListener(
            'click',
            this.switchProject.bind(null, this.id)
        );
        // The browser will be calling the switchProject callback, but we've already bound it to the respective list
    }

    update(newSwitchHandler, type) {
        // Now we need to set the handler to this new handler then call the setup method again
        this.switchProject = newSwitchHandler;
        this.setupSwitchBtn(type);
    }
}

class ProjectList {
    // We can create a field to store the projoect item objects
    // A field is translated into a property after super() is run (when we have inheritance) but before this constructor is run
    projects = [];

    // Since we're creating the objects inside init, we now need to parse the items using the type of project passed
    // Our html already has ids named appropriately so we can simply use the passed type
    constructor(type) {
        this.type = type;
        const projectItems = document.querySelectorAll(`#${type}-projects li`);
        // console.log(projectItems);
        // Let's now create projectItem objects for each project and add it to the projects list
        for (const project of projectItems) {
            // Since we seem to have an id for each project helpfully in the html, we can pass in that id here to constructor
            // const projectItem = new ProjectItem(project.id);
            // this.projects.push(projectItem);
            // In the course this was shortened to just pushing because we don't need to projoect Item anyway
            this.projects.push(
                new ProjectItem(
                    project.id,
                    this.switchProject.bind(this),
                    this.type
                )
            );
        }
    }

    // We only pass the switch handler when both instances are ready so we won't be receiving on the constructor
    setSwitchHandler(handler) {
        // This function should refer to the addProject method of the other instance, so we need to pass it
        this.switchHandler = handler;
    }

    // To handle the switching, we can separate the logic of adding existing projct to a list, and overall switching
    addProject(project) {
        // We need to pass the projec to this method so let's pass it when we call it, i.e. during the binding
        // console.log(this);
        this.projects.push(project);
        // Let's also call the helper function to move the element
        DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);

        // But when we move it, the event handler breaks because the switch button tries to switch from active to finished
        // Even though the switch has already happened, so we should also have an update method in the project item class
        // And we should pass the switchProject of this instance i.e. destination instance
        project.update(this.switchProject.bind(this), this.type);
        // But we should also pass type because we need to update the button text based on this type
    }

    switchProject(projectId) {
        // Inside this, we need to remove current project from the current list to the other list
        // We can do this with multiple methods, one alternative is to get Index then use splice
        // const projectIdx = this.projects.findIndex(p => p.id === project.id);
        // this.projects.splice(projectIdx, 1);
        // Or we can simply use filter
        this.projects.filter((p) => p.id !== projectId);
        // We also need to add project to the other list so let's call addProject as well
        // but if we call addProject from here, it would call this same instance's addProject method which is not what we want
        // So we need a new function which is passed as a callback and it calls the addProject function in the other instance
        this.switchHandler(this.projects.find((p) => p.id === projectId));
        // This passes the project to the other instance's addProject method
    }
}

// This next step I looked at the course and we create a static method in app for initializing the application
// It basically has the main logic for the app we're building, so basically the parsing part for now
// Since all projects are already in the html, we need to select the projects by type and store into two arrays/nodelists
class App {
    static init() {
        const activeProjects = new ProjectList('active');
        const finishedProjects = new ProjectList('finished');
        // Now we need to set the switchHandler here AFTER both the project have been created since we want to refer to one from other
        activeProjects.setSwitchHandler(
            finishedProjects.addProject.bind(finishedProjects)
        );
        finishedProjects.setSwitchHandler(
            activeProjects.addProject.bind(activeProjects)
        );
        // Since this handler will be called by the instance that initiates the switch, we need to bind it so it runs where we want
    }
}

App.init();
