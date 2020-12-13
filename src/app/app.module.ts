import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ImageSlicerComponent } from './components/image-slicer/image-slicer.component';

@NgModule({
  declarations: [AppComponent, ImageSlicerComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
