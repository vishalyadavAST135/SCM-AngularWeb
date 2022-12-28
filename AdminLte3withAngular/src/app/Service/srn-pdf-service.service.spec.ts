import { TestBed } from '@angular/core/testing';

import { SrnPdfServiceService } from './srn-pdf-service.service';

describe('SrnPdfServiceService', () => {
  let service: SrnPdfServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SrnPdfServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
