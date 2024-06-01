import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PruebaDeVida } from '../models/prueba-de-vida';


@Injectable({
  providedIn: 'root'
})
export class PruebaDeVidaService {

  readonly URL_API = environment.apiUrl+"PruebaDeVida";

  constructor(private http: HttpClient) { }

  getPruebasDeVida(email: string) {
    return this.http.get(this.URL_API + "/getByMail/" +
      email);
  }

  getPruebaDeVidaByidPruebaDeVidaMultiple(idPruebaDeVidaMultiple: number){
    return this.http.get(this.URL_API+"/multiple/"+idPruebaDeVidaMultiple); 
   }

  actualizarEstadoAProcesando(pruebaDeVida: PruebaDeVida) {
    return this.http.put(this.URL_API+'/procesando',pruebaDeVida);
  }

}
