import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrnComponent } from './srn.component';

describe('SrnComponent', () => {
  let component: SrnComponent;
  let fixture: ComponentFixture<SrnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
