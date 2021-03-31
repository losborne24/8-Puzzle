import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
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
  @ViewChild('ghostContainer', { static: false })
  ghostContainer: ElementRef<HTMLCanvasElement>;
  @ViewChild('grid', { static: false }) grid: ElementRef;

  @Output() images = new EventEmitter<any>();
  @Output() uploadNew = new EventEmitter<any>();

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

  canvasWidth = 0;
  canvasHeight = 0;
  maxCanvasHeight = 0;
  maxCanvasWidth = 0;
  imagePieces = [];
  // imgData: contents of image uploaded
  imgData: string | ArrayBuffer;

  // filename: name of image uploaded
  filename: string;

  // ctx: canvas used to slice image
  ctx; //: CanvasRenderingContext2D;
  image: HTMLImageElement;

  constructor(private changeDetector: ChangeDetectorRef) {
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
    this.changeDetector.detectChanges();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.maxCanvasHeight = this.windowHeight / 2;
    this.maxCanvasWidth = this.windowWidth / 2;
    if (this.imageFile) {
      this.drawImageProp();
    }
  }
  async onImageLoaded(file) {
    if (typeof file === 'string') {
      // demo images
      await this.convertToString(file);
      this.drawImageProp();
    } else {
      // uploaded images
      //   this.filename = file.name;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async (_) => {
        this.imgData = reader.result;
        await this.convertToString(file);
        this.drawImageProp();
      };
    }
  }
  convertToString(file) {
    if (typeof file === 'string') {
      this.image.src = `assets/images/${file}`;
    } else {
      this.image.src = this.imgData.toString();
    }
  }

  drawImageProp() {
    const imgHeight = this.image.height;
    const imgWidth = this.image.width;
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
    this.canvasWidth = this.ctx.canvas.width;
    this.canvasHeight = this.ctx.canvas.height;
  }
  onComplete() {
    const pieceSize = this.grid.nativeElement.offsetWidth / 3;
    const style = window.getComputedStyle(this.grid.nativeElement);
    const matrix = new WebKitCSSMatrix(style.transform);
    const gridTranslationX = matrix.m41 > 0 ? matrix.m41 : 0;
    const gridTranslationY = matrix.m42 > 0 ? matrix.m42 : 0;

    const colsToCut = 3;
    const rowsToCut = 3;
    const pieceWidth = pieceSize;
    const pieceHeight = pieceSize;
    const image = new Image();

    image.src = this.ctx.canvas.toDataURL();

    setTimeout(() => {
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      canvas.width = pieceWidth * 3;
      canvas.height = pieceHeight * 3;
      context.drawImage(
        image,
        gridTranslationX,
        gridTranslationY,
        pieceWidth * 3,
        pieceHeight * 3,
        0,
        0,
        pieceWidth * 3,
        pieceHeight * 3
      );
      this.imagePieces.push(canvas.toDataURL());
      for (var y = 0; y < rowsToCut; y++) {
        for (var x = 0; x < colsToCut; x++) {
          var canvas = document.createElement('canvas');
          var context = canvas.getContext('2d');
          canvas.width = pieceWidth;
          canvas.height = pieceHeight;
          context.drawImage(
            image,
            x * pieceWidth + gridTranslationX,
            y * pieceHeight + gridTranslationY,
            pieceWidth,
            pieceHeight,
            0,
            0,
            pieceWidth,
            pieceHeight
          );
          this.imagePieces.push(canvas.toDataURL());
        }
      }
      this.images.emit(this.imagePieces);
    }, 0);
  }
  onUploadNew() {
    this.uploadNew.emit(true);
  }
}
