import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaultytorepairComponent } from './faultytorepair.component';

describe('FaultytorepairComponent', () => {
  let component: FaultytorepairComponent;
  let fixture: ComponentFixture<FaultytorepairComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaultytorepairComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaultytorepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
