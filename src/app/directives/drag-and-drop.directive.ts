import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]',
})
export class DragAndDropDirective {
  @Output() fileHover = new EventEmitter<any>();
  @Output() fileDropped = new EventEmitter<any>();

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    this.fileHover.emit(true);
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) onDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    this.fileHover.emit(false);
  }

  // Drop listener
  @HostListener('drop', ['$event']) ondrop(event) {
    event.preventDefault();
    event.stopPropagation();
    this.fileHover.emit(false);
    let files = event.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(files[0]);
    }
  }
}
