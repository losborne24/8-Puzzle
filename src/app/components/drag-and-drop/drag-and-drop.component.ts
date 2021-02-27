import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss'],
})
export class DragAndDropComponent implements OnInit {
  constructor() {}
  files: any[] = [];
  fileHover = false;
  ngOnInit(): void {}
  onFileHover(isFileHover) {
    this.fileHover = isFileHover;
  }

  onFileDropped($event) {
    console.log($event);
    this.prepareFilesList($event);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
  }
}
