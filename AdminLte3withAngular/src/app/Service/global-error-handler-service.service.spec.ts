import { TestBed } from '@angular/core/testing';

import { GlobalErrorHandlerServiceService } from './global-error-handler-service.service';

describe('GlobalErrorHandlerServiceService', () => {
  let service: GlobalErrorHandlerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalErrorHandlerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
