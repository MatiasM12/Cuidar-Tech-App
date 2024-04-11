import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuarios: Usuario[] = [];
  readonly URL_API = environment.apiUrl + 'Usuario';

  constructor(private http: HttpClient) { }

  getUsuarios() {
    return this.http.get(this.URL_API);
  }

  login(email: string, contrasena: string) {
    const loginInfo: { email: string; contrasena: string } = {
      email: email,
      contrasena: contrasena
    };
    return this.http.post(this.URL_API + "/loginApp", loginInfo);
  }

  recuperarContrasena(usuario: Usuario){
    return this.http.put(this.URL_API+"/recuperarContrasena", usuario);
  }

}
