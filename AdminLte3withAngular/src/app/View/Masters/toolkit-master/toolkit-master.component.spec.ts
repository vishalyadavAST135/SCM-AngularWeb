import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolkitMasterComponent } from './toolkit-master.component';

describe('ToolkitMasterComponent', () => {
  let component: ToolkitMasterComponent;
  let fixture: ComponentFixture<ToolkitMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolkitMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolkitMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
