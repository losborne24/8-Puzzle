import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import * as interact from 'interactjs/dist/interact.js';

@Directive({
  selector: '[appDraggableGridItem]',
})
export class DraggableGridItemDirective {
  @Input() appGridPos: number;
  @Input()
  get appEmptyCell(): number {
    return this._emptyCell;
  }
  set appEmptyCell(appEmptyCell: number) {
    this._emptyCell = appEmptyCell;
    this.updateElementDraggable();
  }
  private _emptyCell;

  @Input()
  get appCellSize(): number {
    return this._cellSize;
  }
  set appCellSize(appCellSize: number) {
    this._cellSize = appCellSize;
  }
  private _cellSize;

  acceptableMoves = [
    // left | up | right | down
    [null, null, 1, 3],
    [0, null, 2, 4],
    [1, null, null, 5],
    [null, 0, 4, 6],
    [3, 1, 5, 7],
    [4, 2, null, 8],
    [null, 3, 7, null],
    [6, 4, 8, null],
    [7, 5, null, null],
  ];
  restrictionBox;
  rect;
  // moves = ['up', 'right', 'down', 'left'];
  @Output()
  hasEmptyCellChanged = new EventEmitter<any>();

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
    this.renderer.setStyle(
      this.element.nativeElement,
      'transform',
      'translate(0px,0px)'
    );
    this.renderer.setAttribute(this.element.nativeElement, 'data-x', '0');
    this.renderer.setAttribute(this.element.nativeElement, 'data-y', '0');
    this.updateElementDraggable();
  }

  ngOnInit(): void {}

  updateElementDraggable() {
    if (interact.isSet(this.element.nativeElement)) {
      interact(this.element.nativeElement).unset();
    }
    const direction = this.acceptableMoves[this.appGridPos].indexOf(
      this.appEmptyCell
    );
    setTimeout(() => {
      this.rect = this.element.nativeElement.getBoundingClientRect();
      const size = this.rect.width;
      switch (direction) {
        case 0:
          this.restrictionBox = interact.modifiers.restrictRect({
            restriction: {
              x: this.rect.x - size - 2,
              y: 0,
              width: size * 2 + 2,
              height: size * 2 + 2,
            },
          });
          this.updateInteract('left', size, this.hasEmptyCellChanged);
          break;
        case 1:
          this.restrictionBox = interact.modifiers.restrictRect({
            restriction: {
              x: 0,
              y: this.rect.y - size - 2,
              width: size * 2 + 2,
              height: size * 2 + 2,
            },
          });
          this.updateInteract('up', size, this.hasEmptyCellChanged);
          break;
        case 2:
          this.restrictionBox = interact.modifiers.restrictRect({
            restriction: {
              x: this.rect.x + 2,
              y: 0,
              width: size * 2 + 2,
              height: size * 2 + 2,
            },
          });
          this.updateInteract('right', size, this.hasEmptyCellChanged);
          break;
        case 3:
          this.restrictionBox = interact.modifiers.restrictRect({
            restriction: {
              x: 0,
              y: this.rect.y + 2,
              width: size * 2 + 2,
              height: size * 2 + 2,
            },
          });
          this.updateInteract('down', size, this.hasEmptyCellChanged);
          break;
      }
    }, 0);
  }
  updateInteract(direction, size, hasEmptyCellChanged) {
    let axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
    interact(this.element.nativeElement).draggable({
      lockAxis: axis,
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
        end(event) {
          var target = event.target;
          var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
          if (Math.abs(x) * 6 > size || Math.abs(y) * 6 > size) {
            hasEmptyCellChanged.emit(true);
          }

          target.style.webkitTransform = target.style.transform =
            'translate(' + 0 + 'px, ' + 0 + 'px)';

          target.setAttribute('data-x', 0);
          target.setAttribute('data-y', 0);
        },
      },

      modifiers: [this.restrictionBox],
    });
  }
}
