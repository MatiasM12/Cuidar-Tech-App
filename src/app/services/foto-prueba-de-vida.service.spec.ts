import { TestBed } from '@angular/core/testing';

import { FotoPruebaDeVidaService } from './foto-prueba-de-vida.service';

describe('FotoPruebaDeVidaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FotoPruebaDeVidaService = TestBed.get(FotoPruebaDeVidaService);
    expect(service).toBeTruthy();
  });
});
