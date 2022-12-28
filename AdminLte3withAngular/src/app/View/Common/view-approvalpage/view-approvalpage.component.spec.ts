import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApprovalpageComponent } from './view-approvalpage.component';

describe('ViewApprovalpageComponent', () => {
  let component: ViewApprovalpageComponent;
  let fixture: ComponentFixture<ViewApprovalpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewApprovalpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewApprovalpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
