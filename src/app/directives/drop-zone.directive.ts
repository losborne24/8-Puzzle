import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';
import * as interact from 'interactjs/dist/interact.js';

@Directive({
  selector: '[appDropZone]',
})
export class DropZoneDirective {
  @Output() fileHover = new EventEmitter<any>();
  @Output() fileDropped = new EventEmitter<any>();
  constructor(private element: ElementRef) {}
  ngOnInit(): void {
    interact(this.element.nativeElement)
      .dropzone({
        accept: '.demo-img',
        overlap: 0.75,
      })
      .on('dragenter', (event) => {
        this.fileHover.emit(true);
      })
      .on('dragleave', (event) => {
        this.fileHover.emit(false);
      })
      .on('drop', (event) => {
        this.fileDropped.emit(event.relatedTarget.src);
      });
  }
}
