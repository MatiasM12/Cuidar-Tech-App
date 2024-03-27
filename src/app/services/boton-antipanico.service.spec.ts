import { TestBed } from '@angular/core/testing';

import { BotonAntipanicoService } from './boton-antipanico.service';

describe('BotonAntipanicoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BotonAntipanicoService = TestBed.get(BotonAntipanicoService);
    expect(service).toBeTruthy();
  });
});
