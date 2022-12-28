import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesAccessoriesComponent } from './employees-accessories.component';

describe('EmployeesAccessoriesComponent', () => {
  let component: EmployeesAccessoriesComponent;
  let fixture: ComponentFixture<EmployeesAccessoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeesAccessoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesAccessoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
