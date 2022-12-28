import { TestBed } from '@angular/core/testing';

import { CtcService } from './ctc.service';

describe('CtcService', () => {
  let service: CtcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CtcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
