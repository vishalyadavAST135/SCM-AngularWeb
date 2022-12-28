import { TestBed } from '@angular/core/testing';

import { TimePeriodService } from './time-period.service';

describe('TimePeriodService', () => {
  let service: TimePeriodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimePeriodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
