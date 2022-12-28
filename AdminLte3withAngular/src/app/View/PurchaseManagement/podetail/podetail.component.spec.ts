import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodetailComponent } from './podetail.component';

describe('PodetailComponent', () => {
  let component: PodetailComponent;
  let fixture: ComponentFixture<PodetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PodetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
