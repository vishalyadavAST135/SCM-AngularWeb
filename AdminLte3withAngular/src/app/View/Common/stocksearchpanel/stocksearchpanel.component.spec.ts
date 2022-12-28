import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksearchpanelComponent } from './stocksearchpanel.component';

describe('StocksearchpanelComponent', () => {
  let component: StocksearchpanelComponent;
  let fixture: ComponentFixture<StocksearchpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StocksearchpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksearchpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
