import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComisariaService {

  readonly URL_API = environment.apiUrl+'Comisaria';

  constructor(private http: HttpClient) { }

  getComisaria(){
    return this.http.get(this.URL_API + '/ObtenerComisarias' );
  }

}
