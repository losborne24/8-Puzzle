import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import Konva from 'konva';

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
  stage;
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

  maxCanvasHeight = 0;
  maxCanvasWidth = 0;

  hLineCount = 0;
  vLineCount = 0;
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
    this.stage = new Konva.Stage({
      container: 'konva-container',
      width: 0,
      height: 0,
    });
  }
  ngAfterViewInit(): void {
    this.maxCanvasHeight = this.windowHeight / 2;
    this.maxCanvasWidth = this.windowWidth / 2;
    this.ctx = this.myCanvas.nativeElement.getContext('2d');
  }
  onHLineChange(value) {
    this.hLineCount = value;
  }
  onVLineChange(value) {
    this.vLineCount = value;
  }
  onImageLoaded(file) {
    this.filename = file.name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (_) => {
      this.imgData = reader.result;
      await this.convertToString();
      this.drawImageProp();
    };
  }

  convertToString() {
    this.image.src = this.imgData.toString();
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
    this.stage.width(this.ctx.canvas.width);
    this.stage.height(this.ctx.canvas.height);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.windowWidth = event.target.innerWidth;
    this.windowHeight = event.target.innerHeight;
    this.maxCanvasHeight = this.windowHeight / 2;
    this.maxCanvasWidth = this.windowWidth / 2;
    if (this.imageFile) {
      this.drawImageProp();
    }
  }
  onCropSquareClick() {
    let layer = new Konva.Layer();
    var rect1 = new Konva.Rect({
      x: 20,
      y: 20,
      width: 100,
      height: 100,
      fill: 'rgba(255,255,255,0.2)',
      stroke: 'black',
      strokeWidth: 4,
      draggable: true,
      strokeScaleEnabled: false,
    });
    var rect2 = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.ctx.canvas.width,
      height: this.ctx.canvas.height,
      fill: 'rgba(0,0,0,0.2)',
    });
    // add the shape to the layer
    layer.add(rect2);
    layer.add(rect1);
    this.stage.add(layer);

    var tr1 = new Konva.Transformer({
      nodes: [rect1],
      keepRatio: true,
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    });
    layer.add(tr1);
    layer.add(tr1);
    layer.draw();
  }
  onCropRectClick() {
    let layer = new Konva.Layer();
    var rect1 = new Konva.Rect({
      x: 20,
      y: 20,
      width: 100,
      height: 100,
      fill: 'rgba(255,255,255,0.2)',
      stroke: 'black',
      strokeWidth: 4,
      draggable: true,
      strokeScaleEnabled: false,
    });
    var rect2 = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.ctx.canvas.width,
      height: this.ctx.canvas.height,
      fill: 'rgba(0,0,0,0.2)',
    });
    // add the shape to the layer
    layer.add(rect2);
    layer.add(rect1);
    this.stage.add(layer);

    var tr1 = new Konva.Transformer({
      nodes: [rect1],
      // ignore stroke in size calculations
      ignoreStroke: true,
      // manually adjust size of transformer
      padding: 1,
    });
    layer.add(tr1);
    layer.draw();
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
