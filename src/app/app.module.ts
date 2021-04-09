import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ImageSlicerComponent } from './components/image-slicer/image-slicer.component';
import { DragAndDropComponent } from './components/drag-and-drop/drag-and-drop.component';
import { DragAndDropDirective } from './directives/drag-and-drop.directive';
import { MainComponent } from './components/main/main.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { DraggableDirective } from './directives/draggable.directive';
import { PuzzleComponent } from './components/puzzle/puzzle.component';
import { DraggableGridItemDirective } from './directives/draggable-grid-item.directive';
import { DragAndDropDemoImagesDirective } from './directives/drag-and-drop-demo-images.directive';
import { DropZoneDirective } from './directives/drop-zone.directive';

@NgModule({
  declarations: [
    AppComponent,
    ImageSlicerComponent,
    DragAndDropDirective,
    DragAndDropComponent,
    MainComponent,
    DraggableDirective,
    PuzzleComponent,
    DraggableGridItemDirective,
    DragAndDropDemoImagesDirective,
    DropZoneDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
