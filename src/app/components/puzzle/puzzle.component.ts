import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  disableButtons: boolean = false;
  @Input() originalImage;
  @Input() images;
  @Output() uploadNew = new EventEmitter<any>();
  gridData: Array<number>;
  gridImages;
  gridSize = 0;
  emptyPos;
  removedPos;
  removedPosOptions = [0, 2, 6, 8];
  isShowNumbers = false;
  isComplete = false;
  constructor(
    private aStarSolverService: AStarSolverService,
    private _snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.shuffleItems();
    this.gridSize =
      window.innerWidth < window.innerHeight
        ? window.innerWidth / 2
        : window.innerHeight / 2;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    setTimeout(() => {
      this.gridSize =
        window.innerWidth < event.target.innerHeight
          ? window.innerWidth / 2
          : window.innerHeight / 2;
    }, 0);
  }
  shuffleItems() {
    this.disableButtons = false;
    this.isComplete = false;
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
        this.gridData.splice(this.emptyPos, 0, null);
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
      this.gridData[this.emptyPos] = this.gridData[position];
      this.gridData[position] = null;
      // update grid images
      this.gridImages[this.emptyPos] = this.images[
        this.gridData[this.emptyPos]
      ];
      this.gridImages[position] = null;
      this.emptyPos = position;

      this.isPuzzleComplete();
    }
  }
  isPuzzleComplete() {
    let complete = true;
    for (let i = 0; i < 9; i++) {
      if (this.gridData[i] !== null) {
        if (i !== this.gridData[i]) {
          complete = false;
          break;
        }
      }
    }
    if (complete) {
      setTimeout(() => {
        this.isComplete = true;
      }, 1000);
    }
  }

  onToggleNumbers() {
    this.isShowNumbers = !this.isShowNumbers;
  }
  onAutoSolve() {
    this.disableButtons = true;
    const result = this.aStarSolverService.solvePuzzle(this.gridData);
    if (result !== 'failed') {
      for (let i = 0; i < result.length; i++) {
        setTimeout(() => {
          let nextEmptyCell = result[i].indexOf(null);
          this.hasEmptyCellChanged(true, nextEmptyCell);
        }, i * 250);
      }
    } else {
      this._snackBar.open(
        'Sorry! Our search algoritm was unable to solve this puzzle. Move a few tiles around and try again.',
        'Close',
        {
          duration: 3000,
        }
      );
      this.disableButtons = false;
    }
  }
  onUploadNew() {
    this.uploadNew.emit(true);
  }
}
