import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { inmobiliariaGuard } from './inmobiliaria.guard';

describe('inmobiliariaGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => inmobiliariaGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
