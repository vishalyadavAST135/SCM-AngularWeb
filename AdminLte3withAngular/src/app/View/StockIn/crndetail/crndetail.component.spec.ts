import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrndetailComponent } from './crndetail.component';

describe('CrndetailComponent', () => {
  let component: CrndetailComponent;
  let fixture: ComponentFixture<CrndetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrndetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrndetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
