import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoConfigComponent } from './po-config.component';

describe('PoConfigComponent', () => {
  let component: PoConfigComponent;
  let fixture: ComponentFixture<PoConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
