import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhmasterComponent } from './whmaster.component';

describe('WhmasterComponent', () => {
  let component: WhmasterComponent;
  let fixture: ComponentFixture<WhmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
