import { TestBed } from '@angular/core/testing';

import { PoConfigServiceService } from './po-config-service.service';

describe('PoConfigServiceService', () => {
  let service: PoConfigServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoConfigServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
