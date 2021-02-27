import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  isImageUpload = false;
  imageFile;
  constructor() {}

  ngOnInit(): void {}

  onImageSelected(image) {
    this.imageFile = image;
    this.isImageUpload = true;
  }
}
