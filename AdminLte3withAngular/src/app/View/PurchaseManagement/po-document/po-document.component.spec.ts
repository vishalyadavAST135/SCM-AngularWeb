import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoDocumentComponent } from './po-document.component';

describe('PoDocumentComponent', () => {
  let component: PoDocumentComponent;
  let fixture: ComponentFixture<PoDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
