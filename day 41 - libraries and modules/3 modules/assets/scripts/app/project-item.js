// We need to export this, and import Tooltip and DOMHelper here
// import { Tooltip } from './tooltip.js';
import { DOMHelper } from '../utility/dom-helper.js';
// If the DOMHelper file had exported separate functions instead of just the class, we would need to add the following
// import { DOMHelper, clearEventListeners, moveElement } from '../utility/dom-helper.js';
// Or we could also import everything inside a sinlg object and call it at once. We can do it using * character, and alias using as keyword
// import * as DOMH from '../utility/dom-helper.js'

// If we look at the network tab, we can see that we are making many HTTP requests, and even though file sizes are small here,
// in bigger projects it would be hell to load all the JS files beforehand.
// In order to mitigate this, we can include dynamic imports

export class ProjectItem {
    hasActiveTooltip = false;

    constructor(id, updateProjectListsFunction, type) {
        this.id = id;
        this.updateProjectListsHandler = updateProjectListsFunction;
        this.connectMoreInfoButton();
        this.connectSwitchButton(type);
        this.connectDrag();
    }

    showMoreInfoHandler() {
        console.log(DEFAULT_VALUE);
        if (this.hasActiveTooltip) {
            return;
        }
        const projectElement = document.getElementById(this.id);
        const tooltipText = projectElement.dataset.extraInfo;
        // Since this is where a tooltip is used, we can import it here using a browser prvided method
        import('./tooltip').then((module) => {
            const tooltip = new module.Tooltip(
                () => {
                    this.hasActiveTooltip = false;
                },
                tooltipText,
                this.id
            );
            tooltip.attach();
        });
        // This lets us load tooltip file only when needed, subsequently component too
        // If we have some other code like console.log inide the tooltip/component, it will get executed once when being loaded
        // Then on further uses of the library, it isn't logged
        this.hasActiveTooltip = true;
    }

    connectDrag() {
        const item = document.getElementById(this.id);
        item.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', this.id);
            event.dataTransfer.effectAllowed = 'move';
        });

        item.addEventListener('dragend', (event) => {
            console.log(event);
        });
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
}
