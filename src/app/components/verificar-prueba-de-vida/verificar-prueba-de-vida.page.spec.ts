import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerificarPruebaDeVidaPage } from './verificar-prueba-de-vida.page';

describe('VerificarPruebaDeVidaPage', () => {
  let component: VerificarPruebaDeVidaPage;
  let fixture: ComponentFixture<VerificarPruebaDeVidaPage>;

  beforeEach(async(() => { 
    fixture = TestBed.createComponent(VerificarPruebaDeVidaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
