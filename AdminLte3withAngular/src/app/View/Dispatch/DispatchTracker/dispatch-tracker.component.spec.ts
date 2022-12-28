import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchTrackerComponent } from './dispatch-tracker.component';

describe('DispatchTrackerComponent', () => {
  let component: DispatchTrackerComponent;
  let fixture: ComponentFixture<DispatchTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispatchTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
