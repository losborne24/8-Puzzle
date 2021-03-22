import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import * as interact from 'interactjs/dist/interact.js';

@Directive({
  selector: '[appDraggable]',
})
export class DraggableDirective implements OnInit {
  @Input()
  model: any;

  @Input()
  options: any;

  @Output()
  draggableClick = new EventEmitter();

  private currentlyDragged = false;

  constructor(private element: ElementRef) {}

  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    if (!this.currentlyDragged) {
      this.draggableClick.emit();
    }
  }

  ngOnInit(): void {
    interact(this.element.nativeElement)
      .resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: true, top: true },

        listeners: {
          move(event) {
            var target = event.target;
            var x = parseFloat(target.getAttribute('data-x')) || 0;
            var y = parseFloat(target.getAttribute('data-y')) || 0;

            // update the element's style
            target.style.width = event.rect.width + 'px';
            target.style.height = event.rect.height + 'px';

            // translate when resizing from top or left edges
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.webkitTransform = target.style.transform =
              'translate(' + x + 'px,' + y + 'px)';

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
          },
        },
        modifiers: [
          interact.modifiers.aspectRatio({
            // make sure the width is always double the height
            ratio: 1,
            // keep the edges inside the parent
            modifiers: [
              interact.modifiers.restrictEdges({
                outer: 'parent',
              }), // minimum size
              interact.modifiers.restrictSize({
                min: { width: 100, height: 100 },
              }),
            ],
          }),
        ],
      })
      .draggable({
        listeners: {
          move: function (event) {
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
        inertia: true,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true,
          }),
        ],
      });
    /*interact(this.element.nativeElement)
      .draggable({
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
          }),
        ],
        listeners: {
          start(event) {
            console.log(event.type, event.target);
          },
          move(event) {
            position.x += event.dx;
            position.y += event.dy;

            event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
          },
        },
      })
      .resizable({
        edges: { top: true, left: true, bottom: true, right: true },
        listeners: {
          move: function (event) {
            let { x, y } = event.target.dataset;

            x = (parseFloat(x) || 0) + event.deltaRect.left;
            y = (parseFloat(y) || 0) + event.deltaRect.top;

            Object.assign(event.target.style, {
              width: `${event.rect.width}px`,
              height: `${event.rect.height}px`,
              transform: `translate(${x}px, ${y}px)`,
            });

            Object.assign(event.target.dataset, { x, y });
          },
        },
        modifiers: [
          interact.modifiers.aspectRatio({
            // make sure the width is always double the height
            ratio: 1,
            // also restrict the size by nesting another modifier
            modifiers: [interact.modifiers.restrictSize({ max: 'parent' })],
          }),
        ],
      });*/
  }
  /* dragMoveListener(event) {
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
  }*/
}
