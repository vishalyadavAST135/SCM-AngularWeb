import { TestBed } from '@angular/core/testing';

import { GrncrnService } from './grncrn.service';

describe('GrncrnService', () => {
  let service: GrncrnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrncrnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
