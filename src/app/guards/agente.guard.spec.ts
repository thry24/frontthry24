import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { agenteGuard } from './agente.guard';

describe('agenteGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => agenteGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
