import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPage } from './login.page';
import { UsuarioService } from 'src/app/services/usuario.service'; // Importa el servicio UsuarioService
import { ComunicacionService } from 'src/app/services/comunicacion/comunicacion.service'; // Importa el servicio ComunicacionService

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPage ],
      providers: [UsuarioService, ComunicacionService] // Agrega los servicios necesarios aquí
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
