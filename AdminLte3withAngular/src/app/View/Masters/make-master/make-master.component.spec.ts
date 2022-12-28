import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeMasterComponent } from './make-master.component';

describe('MakeMasterComponent', () => {
  let component: MakeMasterComponent;
  let fixture: ComponentFixture<MakeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
