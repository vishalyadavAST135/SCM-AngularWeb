import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportItemMappingComponent } from './report-item-mapping.component';

describe('ReportItemMappingComponent', () => {
  let component: ReportItemMappingComponent;
  let fixture: ComponentFixture<ReportItemMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportItemMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportItemMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
