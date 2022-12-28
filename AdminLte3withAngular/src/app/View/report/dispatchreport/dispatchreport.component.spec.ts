import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchreportComponent } from './dispatchreport.component';

describe('DispatchreportComponent', () => {
  let component: DispatchreportComponent;
  let fixture: ComponentFixture<DispatchreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispatchreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
