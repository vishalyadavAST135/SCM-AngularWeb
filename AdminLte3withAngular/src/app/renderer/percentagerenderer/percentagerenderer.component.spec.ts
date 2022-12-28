import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentagerendererComponent } from './percentagerenderer.component';

describe('PercentagerendererComponent', () => {
  let component: PercentagerendererComponent;
  let fixture: ComponentFixture<PercentagerendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PercentagerendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentagerendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
