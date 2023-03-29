import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMasterComponent } from './stock-master.component';

describe('StockMasterComponent', () => {
  let component: StockMasterComponent;
  let fixture: ComponentFixture<StockMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
