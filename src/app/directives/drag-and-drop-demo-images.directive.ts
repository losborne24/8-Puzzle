import { Directive, ElementRef, HostListener } from '@angular/core';
import * as interact from 'interactjs/dist/interact.js';

@Directive({
  selector: '[appDragAndDropDemoImages]',
  host: {
    '(window:resize)': 'onResize($event)',
  },
})
export class DragAndDropDemoImagesDirective {
  constructor(private element: ElementRef) {}
  restrictionBox;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.restrictionBox = interact.modifiers.restrictRect({
      restriction: {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      endOnly: true,
    });
    this.setDragInteraction();
  }
  ngOnInit(): void {
    this.restrictionBox = interact.modifiers.restrictRect({
      restriction: {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      endOnly: true,
    });
    this.setDragInteraction();
  }
  setDragInteraction() {
    interact(this.element.nativeElement).draggable({
      listeners: {
        move(event) {
          var target = event.target;
          // keep the dragged position in the data-x/data-y attributes
          var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
          target.style.zIndex = 10;
          // translate the element
          target.style.webkitTransform = target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';
          // update the posiion attributes
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        },
        end(event) {
          var target = event.target;
          target.style.zIndex = 1;
        },
      },
      modifiers: [this.restrictionBox],
      inertia: true,
    });
  }
}
