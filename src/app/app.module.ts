import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ImageSlicerComponent } from './components/image-slicer/image-slicer.component';
import { TestComponent } from './components/test/test.component';

@NgModule({
  declarations: [AppComponent, ImageSlicerComponent, TestComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
