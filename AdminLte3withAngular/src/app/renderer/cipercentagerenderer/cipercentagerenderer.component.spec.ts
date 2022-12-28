import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CIpercentagerendererComponent } from './cipercentagerenderer.component';

describe('CIpercentagerendererComponent', () => {
  let component: CIpercentagerendererComponent;
  let fixture: ComponentFixture<CIpercentagerendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CIpercentagerendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CIpercentagerendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
