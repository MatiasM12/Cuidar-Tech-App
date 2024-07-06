import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class FotoPruebaDeVidaService {

  readonly URL_API = environment.apiUrl+"FotoPruebaDeVida";

  constructor(private http: HttpClient) { }

  postFotoPruebaDeVida(idPruebaDeVida: number, foto: string, accion: string, idUsuario: number, idPersona:number) {
    const body = {
      foto: foto,
      accionRealizada: accion,
      idUsuario: idUsuario,
      idPersona:idPersona
    };  
    return this.http.post(this.URL_API + "/"+ idPruebaDeVida , body);
  }
}
