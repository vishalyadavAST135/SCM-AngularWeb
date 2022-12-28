import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UatloginComponent } from './uatlogin.component';

describe('UatloginComponent', () => {
  let component: UatloginComponent;
  let fixture: ComponentFixture<UatloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UatloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UatloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
