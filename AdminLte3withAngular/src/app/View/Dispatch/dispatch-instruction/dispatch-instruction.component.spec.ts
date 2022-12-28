import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchInstructionComponent } from './dispatch-instruction.component';

describe('DispatchInstructionComponent', () => {
  let component: DispatchInstructionComponent;
  let fixture: ComponentFixture<DispatchInstructionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispatchInstructionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
