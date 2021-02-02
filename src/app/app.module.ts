import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ImageSlicerComponent } from './components/image-slicer/image-slicer.component';
import { TestComponent } from './components/test/test.component';
import { DragAndDropComponent } from './components/drag-and-drop/drag-and-drop.component';
import { DragAndDropDirective } from './directives/drag-and-drop.directive';

import { ProgressComponent } from './components/progress/progress.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageSlicerComponent,
    TestComponent,
    DragAndDropDirective,
    ProgressComponent,
    DragAndDropComponent,
  ],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
