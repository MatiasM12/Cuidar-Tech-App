import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class RestriccionService {

  readonly URL_API = environment.apiUrl+"RestriccionDTO";

  constructor(private http:HttpClient) { }

  getRestricciones(email: string){
    return this.http.get(this.URL_API+ "/getByUsuarioApp/" +email);
  }
}
