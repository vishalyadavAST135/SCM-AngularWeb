import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalrendererComponent } from './approvalrenderer.component';

describe('ApprovalrendererComponent', () => {
  let component: ApprovalrendererComponent;
  let fixture: ComponentFixture<ApprovalrendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalrendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalrendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
