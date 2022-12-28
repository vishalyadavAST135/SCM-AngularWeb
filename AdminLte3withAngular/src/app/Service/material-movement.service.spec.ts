import { TestBed } from '@angular/core/testing';

import { MaterialMovementService } from './material-movement.service';

describe('MaterialMovementService', () => {
  let service: MaterialMovementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialMovementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
