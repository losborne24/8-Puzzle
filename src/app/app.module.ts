import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ImageSlicerComponent } from './components/image-slicer/image-slicer.component';
import { TestComponent } from './components/test/test.component';
import { DragAndDropDirective } from './directives/drag-and-drop.directive';
import { DragAndDropComponent } from './components/drag-and-drop/drag-and-drop.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    ImageSlicerComponent,
    TestComponent,
    DragAndDropDirective,
    DragAndDropComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
