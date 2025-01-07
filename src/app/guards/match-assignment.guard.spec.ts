import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { matchAssignmentGuard } from './match-assignment.guard';

describe('matchAssignmentGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => matchAssignmentGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
