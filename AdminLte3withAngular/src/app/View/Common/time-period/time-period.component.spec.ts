import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimePeriodComponent } from './time-period.component';

describe('TimePeriodComponent', () => {
  let component: TimePeriodComponent;
  let fixture: ComponentFixture<TimePeriodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimePeriodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimePeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
