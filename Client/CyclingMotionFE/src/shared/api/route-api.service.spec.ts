import { TestBed } from '@angular/core/testing';

import { RouteApiService } from './route-api.service';

describe('RouteApiService', () => {
  let service: RouteApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
