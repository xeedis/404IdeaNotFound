import { TestBed } from '@angular/core/testing';

import { RoutePlanningService } from './route-planning.service';

describe('RoutePlanningService', () => {
  let service: RoutePlanningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoutePlanningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
