import { TestBed } from '@angular/core/testing';

import { BOQRequestequestService } from './boqrequestequest.service';

describe('BOQRequestequestService', () => {
  let service: BOQRequestequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BOQRequestequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
