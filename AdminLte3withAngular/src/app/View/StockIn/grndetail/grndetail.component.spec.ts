import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GRNDetailComponent } from './grndetail.component';

describe('GRNDetailComponent', () => {
  let component: GRNDetailComponent;
  let fixture: ComponentFixture<GRNDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GRNDetailComponent ]
    })
    .compileComponents();


    
  }));
////// ////////
  beforeEach(() => {
    fixture = TestBed.createComponent(GRNDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
