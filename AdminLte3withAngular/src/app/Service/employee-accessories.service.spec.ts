import { TestBed } from '@angular/core/testing';

import { EmployeeAccessoriesService } from './employee-accessories.service';

describe('EmployeeAccessoriesService', () => {
  let service: EmployeeAccessoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeAccessoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
