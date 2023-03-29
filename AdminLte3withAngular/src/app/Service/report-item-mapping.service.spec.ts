import { TestBed } from '@angular/core/testing';

import { ReportItemMappingService } from './report-item-mapping.service';

describe('ReportItemMappingService', () => {
  let service: ReportItemMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportItemMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
