import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgingreportComponent } from './agingreport.component';

describe('AgingreportComponent', () => {
  let component: AgingreportComponent;
  let fixture: ComponentFixture<AgingreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgingreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgingreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
