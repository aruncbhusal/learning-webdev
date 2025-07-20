// In order to make use of the exported component.js file, we need to import it, for that we can do import .. from 'path'
// import { Component } from './component.js';
// These modules that are meant to be imported can sometimes be given the extension of .mjs, but it it just for conveying meaning

// We also need to export this, and now the code should work as expected

// In order to use a default export from another file, we can omit the curly braces, and we can define the name of module to bring here
import Cmp from './component.js';
// Since we're using an alias, we need to also update anywhere we have used it so that we can access it

export class Tooltip extends Cmp {
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
