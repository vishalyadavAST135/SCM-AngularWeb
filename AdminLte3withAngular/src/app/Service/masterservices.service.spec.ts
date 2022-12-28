import { TestBed } from '@angular/core/testing';

import { MasterservicesService } from './masterservices.service';

describe('MasterservicesService', () => {
  let service: MasterservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
