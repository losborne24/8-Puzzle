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
        gridPos: i,
        correctPos: i,
      });
    }
    for (let i = 0; i < 9; i++) {
      const gridItem = this.gridData.find((obj) => obj.gridPos === i);
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
}
