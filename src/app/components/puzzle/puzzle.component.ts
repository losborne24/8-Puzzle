import { Component, HostListener, Input, OnInit } from '@angular/core';
import { AStarSolverService } from 'src/app/services/a-star-solver.service';

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
  gridData: Array<number>;
  gridImages; // = [];
  gridSize = 0;
  emptyPos;
  removedPos;
  removedPosOptions = [0, 2, 6, 8];
  isShowNumbers = false;
  constructor(private aStarSolverService: AStarSolverService) {}

  ngOnInit(): void {
    this.gridSize =
      window.innerWidth < window.innerHeight
        ? window.innerWidth / 2
        : window.innerHeight / 2;
    this.shuffleItems();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.gridSize =
      window.innerWidth < event.target.innerHeight
        ? window.innerWidth / 2
        : window.innerHeight / 2;
  }
  shuffleItems() {
    this.gridImages = [];

    this.removedPos = this.removedPosOptions[Math.floor(Math.random() * 4)]; // 0, 2, 6, 8
    this.emptyPos = Math.floor(Math.random() * 9);

    this.gridData = [];
    for (let i = 0; i < 9; i++) {
      if (i !== this.removedPos) {
        this.gridData.push(i);
      }
    }
    let isSolvable = false;
    while (!isSolvable) {
      let inversions = 0;
      this.shuffleArray(this.gridData);
      for (let i = 0; i < 8; i++) {
        for (let j = i + 1; j < 8; j++) {
          if (this.gridData[i] > this.gridData[j]) {
            inversions++;
          }
        }
      }
      if (inversions % 2 === 0) {
        isSolvable = true;
        this.gridData.splice(this.emptyPos, 0, this.removedPos);
        break;
      }
    }
    for (let i = 0; i < 9; i++) {
      if (i === this.emptyPos) {
        this.gridImages.push(null);
      } else {
        this.gridImages.push(this.images[this.gridData[i]]);
      }
    }
  }
  shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
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
  onAutoSolve() {
    const result = this.aStarSolverService.solvePuzzle(
      this.gridData,
      this.emptyPos
    );
    console.log(result);
    if (result !== 'failed') {
      for (let i = 0; i < result.length; i++) {
        setTimeout(() => {
          let nextEmptyCell = result[i].indexOf(null);
          this.hasEmptyCellChanged(true, nextEmptyCell);
          console.log(result[i].indexOf(null));
        }, i * 250);
      }
    }
  }
}
