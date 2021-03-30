import { Directive, ElementRef } from '@angular/core';
import * as interact from 'interactjs/dist/interact.js';

@Directive({
  selector: '[appDragAndDropDemoImages]',
})
export class DragAndDropDemoImagesDirective {
  constructor(private element: ElementRef) {}
  ngOnInit(): void {
    interact(this.element.nativeElement).draggable({
      listeners: {
        move(event) {
          var target = event.target;
          // keep the dragged position in the data-x/data-y attributes
          var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

          // translate the element
          target.style.webkitTransform = target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

          // update the posiion attributes
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        },
      },
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: {
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          },
          endOnly: true,
        }),
      ],
      inertia: true,
    });
  }
}
