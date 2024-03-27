import { Injectable } from '@angular/core';
import { RestriccionDTO } from 'src/app/models/restriccion-dto';
import { Contacto } from 'src/app/models/contacto';

@Injectable({
  providedIn: 'root'
})
export class ComunicacionService {

  restriccionDTO: RestriccionDTO | null = null;
  contacto: Contacto | null = null;
  emailUsuario: string = "";

  constructor() { }

  enviarRestriccion(restriccion: RestriccionDTO) {
    this.restriccionDTO = restriccion;
  }

  enviarContacto(contacto: Contacto) {
    this.contacto = contacto;
  }

  enviarEmailUsuario(emailUsuario: string) {
    this.emailUsuario = emailUsuario;
  }
}
