import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScmrecpercentagerenderrerComponent } from './scmrecpercentagerenderrer.component';

describe('ScmrecpercentagerenderrerComponent', () => {
  let component: ScmrecpercentagerenderrerComponent;
  let fixture: ComponentFixture<ScmrecpercentagerenderrerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScmrecpercentagerenderrerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScmrecpercentagerenderrerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
