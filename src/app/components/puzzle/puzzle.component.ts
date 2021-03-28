import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)',
  },
})
export class PuzzleComponent implements OnInit {
  @Input() images;
  gridData = [];
  gridImages = [];
  gridSize = 0;
  emptyPos;
  removedPosOptions = [0, 2, 6, 8];
  removedPos: number;
  constructor() {}

  ngOnInit(): void {
    this.removedPos = 0; // this.removedPosOptions[Math.floor(Math.random() * 4)];
    this.emptyPos = this.removedPos;
    this.gridSize =
      window.innerWidth < window.innerHeight
        ? window.innerWidth / 2
        : window.innerHeight / 2;
    for (let i = 0; i < 9; i++) {
      this.gridData.push({
        gridPos: 8 - i,
        correctPos: i,
      });
    }
    for (let i = 0; i < 9; i++) {
      const gridItem = this.gridData.find((obj) => obj.gridPos === i);
      console.log(gridItem);
      if (i === this.removedPos) {
        this.gridImages.push(null);
      } else {
        this.gridImages.push(this.images[gridItem.correctPos]);
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.gridSize =
      window.innerWidth < event.target.innerHeight
        ? window.innerWidth / 2
        : window.innerHeight / 2;
  }
  hasEmptyCellChanged(hasChanged, position) {
    if (hasChanged) {
      // update grid data
      const newPosCell = this.gridData.find(
        (obj) => obj.gridPos === this.emptyPos
      );
      newPosCell.gridPos = position;
      const newEmptyPosCell = this.gridData.find(
        (obj) => obj.gridPos === position
      );
      newEmptyPosCell.gridPos = this.emptyPos;

      // update grid images
      this.gridImages[this.emptyPos] = this.images[newEmptyPosCell.correctPos];
      this.gridImages[position] = null;
      this.emptyPos = position;
    }
  }
}
