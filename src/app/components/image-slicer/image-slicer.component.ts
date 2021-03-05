import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-image-slicer',
  templateUrl: './image-slicer.component.html',
  styleUrls: ['./image-slicer.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)',
  },
})
export class ImageSlicerComponent implements OnInit {
  @ViewChild('myCanvas', { static: false })
  myCanvas: ElementRef<HTMLCanvasElement>;

  windowWidth = 0;
  windowHeight = 0;

  _imageFile;

  @Input()
  get imageFile() {
    return this._imageFile;
  }
  set imageFile(imageFile) {
    this._imageFile = imageFile;
    this.onImageLoaded(imageFile);
  }

  canvasHeight = 0;
  canvasWidth = 0;

  maxCanvasHeight = 0;
  maxCanvasWidth = 0;

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

  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }
  ngAfterViewInit(): void {
    this.maxCanvasHeight = this.windowHeight / 2;
    this.maxCanvasWidth = this.windowWidth / 2;
    this.ctx = this.myCanvas.nativeElement.getContext('2d');
    // this.ctx.canvas.height = this.canvasHeight; //this.image.height;
    //  this.ctx.canvas.width = this.canvasWidth; //this.image.width;
    // this.ctx.fillStyle = '#333333';
    // this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  onImageLoaded(file) {
    // get name and data from upload event
    // const file = event.target.files[0];
    this.filename = file.name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (_event) => {
      this.imgData = reader.result;
      await this.convertToString();
      this.drawImageProp();
      /*
      this.ctx.strokeStyle = '#FF0000';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(100, 100);
      this.ctx.lineTo(100, 400);
      this.ctx.stroke();*/
    };
  }

  convertToString() {
    this.image.src = this.imgData.toString();
  }
  /**
   * By Ken Fyrstenberg Nilsen
   *
   * drawImageProp(context, image [, x, y, width, height [,offsetX, offsetY]])
   *
   * If image and context are only arguments rectangle will equal canvas
   */
  drawImageProp() {
    const imgHeight = this.image.height;
    const imgWidth = this.image.width;
    //const canvasHeight = this.canvasHeight;
    //const canvasWidth = this.canvasWidth;
    if (imgHeight <= this.maxCanvasHeight && imgWidth <= this.maxCanvasWidth) {
      this.ctx.canvas.width = imgWidth;
      this.ctx.canvas.height = imgHeight;
      this.ctx.drawImage(this.image);
    } else {
      const heightDiff = imgHeight / this.maxCanvasHeight;
      const widthDiff = imgWidth / this.maxCanvasWidth;
      if (heightDiff > widthDiff) {
        this.ctx.canvas.width = imgWidth / heightDiff;
        this.ctx.canvas.height = this.maxCanvasHeight;
        this.ctx.drawImage(
          this.image,
          (this.ctx.canvas.width - imgWidth / heightDiff) / 2,
          0,
          imgWidth / heightDiff,
          this.maxCanvasHeight
        );
      } else {
        this.ctx.canvas.width = this.maxCanvasWidth;
        this.ctx.canvas.height = imgHeight / widthDiff;
        this.ctx.drawImage(
          this.image,
          0,
          (this.ctx.canvas.height - imgHeight / widthDiff) / 2,
          this.maxCanvasWidth,
          imgHeight / widthDiff
        );
      }
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.windowWidth = event.target.innerWidth;
    this.windowHeight = event.target.innerHeight;
    this.maxCanvasHeight = this.windowHeight / 2;
    this.maxCanvasWidth = this.windowWidth / 2;
    if (this.imageFile) {
      this.ctx = this.myCanvas.nativeElement.getContext('2d');
      // this.ctx.canvas.height = this.canvasHeight; //this.image.height;
      //  this.ctx.canvas.width = this.canvasWidth; //this.image.width;
      //  this.ctx.fillStyle = '#333333';
      //    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.drawImageProp();
    }
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
