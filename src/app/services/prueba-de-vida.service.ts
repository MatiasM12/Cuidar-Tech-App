import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


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

}
