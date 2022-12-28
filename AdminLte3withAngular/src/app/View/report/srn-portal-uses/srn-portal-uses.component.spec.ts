import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrnPortalUsesComponent } from './srn-portal-uses.component';

describe('SrnPortalUsesComponent', () => {
  let component: SrnPortalUsesComponent;
  let fixture: ComponentFixture<SrnPortalUsesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrnPortalUsesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrnPortalUsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
