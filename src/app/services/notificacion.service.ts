import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  readonly URL_API = environment.apiUrl+'Notificacion';

  constructor(private http: HttpClient) { }

  getNotificacionesNoVistas(email: String){
    return this.http.get(this.URL_API + '/getNoVistas/' + email);
  }

  getNoificaciones(email: string){
    return this.http.get(this.URL_API + "/App/" + email);
  }

}
