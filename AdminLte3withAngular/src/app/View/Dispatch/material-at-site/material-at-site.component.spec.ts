import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialAtSiteComponent } from './material-at-site.component';

describe('MaterialAtSiteComponent', () => {
  let component: MaterialAtSiteComponent;
  let fixture: ComponentFixture<MaterialAtSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialAtSiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialAtSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
