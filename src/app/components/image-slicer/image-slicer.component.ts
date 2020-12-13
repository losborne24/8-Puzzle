import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-slicer',
  templateUrl: './image-slicer.component.html',
  styleUrls: ['./image-slicer.component.scss'],
})
export class ImageSlicerComponent implements OnInit {
  imgUrl: string | ArrayBuffer;
  filename: string;
  constructor() {}
  ngOnInit(): void {}
  onImageChange(event) {
    const file = event.target.files[0];
    this.filename = file.name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.imgUrl = reader.result;
    };
  }
}
