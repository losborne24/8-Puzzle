import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  screenDisplayed = 'UPLOAD';
  imageFile;
  images;
  originalImage;
  constructor() {}

  ngOnInit(): void {}

  onImageSelected(image) {
    this.imageFile = image;
    this.screenDisplayed = 'CROP';
  }
  onImageCrop(images) {
    this.screenDisplayed = 'PUZZLE';
    this.originalImage = images[0];
    this.images = images.slice(1);
  }
  onUploadNew(event) {
    if (event) {
      this.screenDisplayed = 'UPLOAD';
    }
  }
}
