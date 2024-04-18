import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BotonAntipanico } from '../models/boton-antipanico';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BotonAntipanicoService {

  readonly URL_API = environment.apiUrl+'BotonAntipanico';

  constructor(private http: HttpClient) { }

  alertar(botonAntipanico: BotonAntipanico, email: string){
    return this.http.post(this.URL_API + "/" + email, botonAntipanico);
  }

  alertarPolicia(lat: number, lon : number){
    return this.http.post(this.URL_API + "/alertarPolicia/" + lat + '/' + lon,"");
  }

}
