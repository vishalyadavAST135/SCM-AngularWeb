import { TestBed } from '@angular/core/testing';

import { CommonpdfService } from './commonpdf.service';

describe('CommonpdfService', () => {
  let service: CommonpdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonpdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
