import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HopercentagerendererComponent } from './hopercentagerenderer.component';

describe('HopercentagerendererComponent', () => {
  let component: HopercentagerendererComponent;
  let fixture: ComponentFixture<HopercentagerendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HopercentagerendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HopercentagerendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
