import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailHistoryComponent } from './mail-history.component';

describe('MailHistoryComponent', () => {
  let component: MailHistoryComponent;
  let fixture: ComponentFixture<MailHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
