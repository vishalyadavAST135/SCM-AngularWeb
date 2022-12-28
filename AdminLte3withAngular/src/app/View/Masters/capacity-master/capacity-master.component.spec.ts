import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacityMasterComponent } from './capacity-master.component';

describe('CapacityMasterComponent', () => {
  let component: CapacityMasterComponent;
  let fixture: ComponentFixture<CapacityMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapacityMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapacityMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
