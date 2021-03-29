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
  isShowNumbers = false;
  constructor() {}

  ngOnInit(): void {
    this.removedPos = 0; // this.removedPosOptions[Math.floor(Math.random() * 4)];
    this.emptyPos = this.removedPos;
    this.gridSize =
      window.innerWidth < window.innerHeight
        ? window.innerWidth / 2
        : window.innerHeight / 2;
    for (let i = 0; i < 9; i++) {
      this.gridData.push(8 - i);
    }
    for (let i = 0; i < 9; i++) {
      if (i === this.removedPos) {
        this.gridImages.push(null);
      } else {
        this.gridImages.push(this.images[this.gridData[i]]);
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
      const temp = this.gridData[this.emptyPos];
      this.gridData[this.emptyPos] = this.gridData[position];
      this.gridData[position] = temp;
      // update grid images
      this.gridImages[this.emptyPos] = this.images[
        this.gridData[this.emptyPos]
      ];
      this.gridImages[position] = null;
      this.emptyPos = position;
      const isComplete = this.isPuzzleComplete();
      console.log(isComplete);
    }
  }
  isPuzzleComplete() {
    let complete = true;
    for (let i = 0; i < 9; i++) {
      if (i !== this.gridData[i]) {
        complete = false;
        return complete;
      }
    }
    return complete;
  }
  onToggleNumbers() {
    this.isShowNumbers = !this.isShowNumbers;
  }
}
