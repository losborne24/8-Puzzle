import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.scss'],
})
export class PuzzleComponent implements OnInit {
  @Input() images;
  constructor() {}

  ngOnInit(): void {}
}
