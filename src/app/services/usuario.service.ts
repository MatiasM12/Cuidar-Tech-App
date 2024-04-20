import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario';
import { environment } from '../../environments/environment';
import { CapacitorHttp } from '@capacitor/core';

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
    const options = {
      url: `${this.URL_API}/loginApp`, 
      headers: {
        'Content-Type': 'application/json' 
      },
      data: JSON.stringify(loginInfo) 
    };
    
    console.log("🚀 ~ UsuarioService ~ login ~ loginInfo:", loginInfo.email, loginInfo.contrasena)
    return CapacitorHttp.post(options);
  }

  recuperarContrasena(usuario: Usuario){
    return this.http.put(this.URL_API+"/recuperarContrasena", usuario);
  }

}
