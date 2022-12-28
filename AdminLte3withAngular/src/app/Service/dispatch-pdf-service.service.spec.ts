import { TestBed } from '@angular/core/testing';

import { DispatchPdfServiceService } from './dispatch-pdf-service.service';

describe('DispatchPdfServiceService', () => {
  let service: DispatchPdfServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DispatchPdfServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
