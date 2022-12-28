import { TestBed } from '@angular/core/testing';

import { DispatchInstructionService } from './dispatch-instruction.service';

describe('DispatchInstructionService', () => {
  let service: DispatchInstructionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DispatchInstructionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
