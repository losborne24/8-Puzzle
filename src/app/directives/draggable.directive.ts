import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import * as interact from 'interactjs/dist/interact.js';

@Directive({
  selector: '[appDraggable]',
  host: {
    '(window:resize)': 'onResize($event)',
  },
})
export class DraggableDirective implements OnInit {
  @Output()
  draggableClick = new EventEmitter();

  private currentlyDragged = false;

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    if (!this.currentlyDragged) {
      this.draggableClick.emit();
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let size =
      window.innerWidth < window.innerHeight
        ? window.innerWidth
        : window.innerHeight;

    this.renderer.setStyle(
      this.element.nativeElement,
      'width',
      `${size * 0.225}px`
    );
    this.renderer.setStyle(
      this.element.nativeElement,
      'height',
      `${size * 0.225}px`
    );
    this.renderer.setStyle(
      this.element.nativeElement,
      'transform',
      'translate(0px,0px)'
    );
    this.renderer.setAttribute(this.element.nativeElement, 'data-x', '0');
    this.renderer.setAttribute(this.element.nativeElement, 'data-y', '0');
  }

  ngOnInit(): void {
    this.onResize(null);
    interact(this.element.nativeElement)
      .resizable({
        // resize from all edges and corners
        edges: { left: false, right: true, bottom: true, top: false },

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
                min: { width: 68, height: 68 },
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
  }
}
