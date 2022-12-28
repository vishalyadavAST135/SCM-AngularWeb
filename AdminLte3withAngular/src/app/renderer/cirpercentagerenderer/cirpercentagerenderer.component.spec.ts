import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CirpercentagerendererComponent } from './cirpercentagerenderer.component';

describe('CirpercentagerendererComponent', () => {
  let component: CirpercentagerendererComponent;
  let fixture: ComponentFixture<CirpercentagerendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CirpercentagerendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CirpercentagerendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
