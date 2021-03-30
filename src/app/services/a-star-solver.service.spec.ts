import { TestBed } from '@angular/core/testing';

import { AStarSolverService } from './a-star-solver.service';

describe('AStarSolverService', () => {
  let service: AStarSolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AStarSolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
