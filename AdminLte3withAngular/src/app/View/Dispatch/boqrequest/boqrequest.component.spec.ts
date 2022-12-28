import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BOQRequestComponent } from './boqrequest.component';

describe('BOQRequestComponent', () => {
  let component: BOQRequestComponent;
  let fixture: ComponentFixture<BOQRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BOQRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BOQRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
