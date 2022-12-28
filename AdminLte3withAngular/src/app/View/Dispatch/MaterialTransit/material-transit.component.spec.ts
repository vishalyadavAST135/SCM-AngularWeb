import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialTransitComponent } from './material-transit.component';

describe('MaterialTransitComponent', () => {
  let component: MaterialTransitComponent;
  let fixture: ComponentFixture<MaterialTransitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialTransitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialTransitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
