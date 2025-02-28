import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminNoAuthGuard } from './admin--no-auth.guard';

describe('adminNoAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminNoAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
