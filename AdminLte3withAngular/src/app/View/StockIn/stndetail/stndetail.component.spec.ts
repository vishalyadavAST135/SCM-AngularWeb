import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StndetailComponent } from './stndetail.component';

describe('StndetailComponent', () => {
  let component: StndetailComponent;
  let fixture: ComponentFixture<StndetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StndetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StndetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
