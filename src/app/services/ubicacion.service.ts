import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UbicacionDTO } from '../models/ubicacion-dto';
import { environment } from '../../environments/environment';
import { of } from 'rxjs';
import { CapacitorHttp } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {

  readonly URL_API = environment.apiUrl+'Ubicacion';

  constructor(private http: HttpClient) { }

  postUbicacion(email: string, latitud: number | undefined, longitud: number | undefined) {
    if (latitud === undefined || longitud === undefined) {
      // Manejar el caso en el que latitud o longitud son undefined
      console.error('Latitud o longitud son undefined');  
    }
    
    // Configuración de la solicitud HTTP
    const options = {
      url: `${this.URL_API}/postUbi/${email}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        latitud: latitud,
        longitud: longitud
      }
    };

    
    console.log("HAGO EL POST lat: " + latitud + "    lon: " + longitud + "   email: " + email);
    console.log(this.http.post(this.URL_API + "/postUbi/" + email, options));
    return CapacitorHttp.post(options);
  }
  

  getUbicacionesRestriccion(idRestriccion: number) {
    return this.http.get(this.URL_API + "/getByRestriccion/" + idRestriccion);
  }

  getEstaInfringiendo(idRestriccion: number, ubicacionDTO: UbicacionDTO) {
    return this.http.post(this.URL_API + "/infringe/" + idRestriccion, ubicacionDTO);
  }

}
