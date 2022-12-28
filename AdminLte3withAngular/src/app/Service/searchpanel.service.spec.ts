import { TestBed } from '@angular/core/testing';

import { SearchpanelService } from './searchpanel.service';

describe('SearchpanelService', () => {
  let service: SearchpanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchpanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
