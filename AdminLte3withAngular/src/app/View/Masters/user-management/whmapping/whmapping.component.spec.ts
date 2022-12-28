import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WHMappingComponent } from './whmapping.component';

describe('WHMappingComponent', () => {
  let component: WHMappingComponent;
  let fixture: ComponentFixture<WHMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WHMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WHMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
