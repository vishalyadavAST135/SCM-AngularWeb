import { TestBed } from '@angular/core/testing';

import { SiteServiceService } from './site-service.service';

describe('SiteServiceService', () => {
  let service: SiteServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiteServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
