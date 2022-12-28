import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialInstallationComponent } from './material-installation.component';

describe('MaterialInstallationComponent', () => {
  let component: MaterialInstallationComponent;
  let fixture: ComponentFixture<MaterialInstallationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialInstallationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialInstallationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
