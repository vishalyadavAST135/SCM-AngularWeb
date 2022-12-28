import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitePanelComponent } from './site-panel.component';

describe('SitePanelComponent', () => {
  let component: SitePanelComponent;
  let fixture: ComponentFixture<SitePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
