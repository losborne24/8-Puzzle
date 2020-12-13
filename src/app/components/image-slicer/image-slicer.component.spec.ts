import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSlicerComponent } from './image-slicer.component';

describe('ImageSlicerComponent', () => {
  let component: ImageSlicerComponent;
  let fixture: ComponentFixture<ImageSlicerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageSlicerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSlicerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
