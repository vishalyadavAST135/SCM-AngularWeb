import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyMappingComponent } from './company-mapping.component';

describe('CompanyMappingComponent', () => {
  let component: CompanyMappingComponent;
  let fixture: ComponentFixture<CompanyMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
