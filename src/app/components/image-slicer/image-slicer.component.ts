import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-slicer',
  templateUrl: './image-slicer.component.html',
  styleUrls: ['./image-slicer.component.scss'],
})
export class ImageSlicerComponent implements OnInit {
  @ViewChild('myCanvas', { static: false })
  myCanvas: ElementRef<HTMLCanvasElement>;

  // imgData: contents of image uploaded
  imgData: string | ArrayBuffer;

  // filename: name of image uploaded
  filename: string;

  // ctx: canvas used to slice image
  ctx; //: CanvasRenderingContext2D;
  image: HTMLImageElement;

  constructor() {
    this.image = new Image();
  }

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.ctx = this.myCanvas.nativeElement.getContext('2d');
  }
  onImageChange(event) {
    // get name and data from upload event
    const file = event.target.files[0];
    this.filename = file.name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (_event) => {
      this.imgData = reader.result;
      await this.convertToString();
      this.ctx.canvas.height = this.image.height;
      this.ctx.canvas.width = this.image.width;
      this.ctx.drawImage(this.image, 0, 0);
    };
  }

  convertToString() {
    this.image.src = this.imgData.toString();
  }
  displayCanvas() {
    this.ctx.drawImage(this.image, 0, 0);
    // set cursor pointer
  }
  /*onSliceImage() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    var imagePieces = [];
    const numColsToCut = 3;
    const numRowsToCut = 3;
    const widthOfOnePiece = 200;
    const heightOfOnePiece = 200;
    const image = new Image();
    image.src = this.imgData.toString();

    for (var x = 0; x < numColsToCut; x++) {
      for (var y = 0; y < numRowsToCut; y++) {
        var canvas = document.createElement('canvas');
        canvas.width = widthOfOnePiece;
        canvas.height = heightOfOnePiece;
        var context = canvas.getContext('2d');
        context.drawImage(
          image,
          x * widthOfOnePiece,
          y * heightOfOnePiece,
          widthOfOnePiece,
          heightOfOnePiece,
          0,
          0,
          canvas.width,
          canvas.height
        );
        imagePieces.push(canvas.toDataURL());
      }
    }
    this.imgData = imagePieces[0];
  }*/
}
