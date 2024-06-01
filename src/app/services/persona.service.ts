import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  readonly URL_API = environment.apiUrl+"Persona";

  constructor(private http: HttpClient) { }

  getPersonaByIdUsuario(idUsuario: number) {
    return this.http.get(this.URL_API + "/GetByIdUsuario/" +idUsuario);
  }


}
