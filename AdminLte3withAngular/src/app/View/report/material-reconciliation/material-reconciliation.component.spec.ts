import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialReconciliationComponent } from './material-reconciliation.component';

describe('MaterialReconciliationComponent', () => {
  let component: MaterialReconciliationComponent;
  let fixture: ComponentFixture<MaterialReconciliationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialReconciliationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialReconciliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
