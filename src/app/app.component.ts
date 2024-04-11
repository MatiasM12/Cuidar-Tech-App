import { Component } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Geoposition } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import { ComunicacionService } from './services/comunicacion/comunicacion.service';
import { UbicacionService } from './services/ubicacion.service';
import { NotificacionService } from './services/notificacion.service';
import { Notificacion } from './models/notificacion';
import { ForegroundService } from '@ionic-native/foreground-service/ngx';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private backgroundMode: BackgroundMode,
    private localNotifications: LocalNotifications,
    private comunicacion: ComunicacionService,
    private ubicacionService: UbicacionService,
    private notificacionService: NotificacionService,
    public geolocation: Geolocation,
    private foregroundService: ForegroundService,
    private http: HttpClient,
    private storage: Storage
  ) {
    this.email = "victima1@victima1.com"
    this.initializeApp();
  }


  private latitud: number | undefined; // O el tipo de dato que corresponda
  private longitud: number | undefined; // O el tipo de dato que corresponda

  private contador = 0;
  readonly URL_API = 'http://192.168.0.18:9090/' + 'Ubicacion';
  private email = localStorage.getItem("emailUsuario")




  async initializeApp() {
    await this.storage.create();
    this.platform.ready().then(() => {

      this.foregroundService.start('GPS Running', 'Background Service');
      //setInterval(() => this.notificar(), 20000);
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#ffffff');
      this.splashScreen.hide();

      this.backgroundMode.on('activate').subscribe(() => {
      console.log("Background activado");
      this.backgroundMode.disableWebViewOptimizations();
      Geolocation.getCurrentPosition().then((resp) => {
        this.latitud = resp.coords.latitude;
        this.longitud = resp.coords.longitude;
        console.log("lat:" + this.latitud + "lon: " + this.longitud);

      }).catch((error) => {
        console.log('Error getting location', error);
      });

      setInterval(() => this.hagoElPost(), 10000);
      setInterval(() => console.log("Hora " + (new Date()).toUTCString()), 10000);
    });

      this.backgroundMode.disableBatteryOptimizations();
      this.backgroundMode.overrideBackButton();
      this.backgroundMode.excludeFromTaskList();
      setInterval(() => this.notificarDos(), 10000);
      this.backgroundMode.enable();

    });
  }

  async hagoElPost() {
    console.log("Interval de 10 segs");
    Geolocation.getCurrentPosition({maximumAge: 1000, timeout: 5000, enableHighAccuracy: true }).then((resp) => { 
      this.latitud = resp.coords.latitude;
      this.longitud = resp.coords.longitude;
      console.log("lat:" +this.latitud+"lon: " +this.latitud);

     }).catch((error) => {
       console.log('Error getting location', error);
       if (error.code === 1) {
        console.log('Permiso denegado para acceder a la ubicación.');
      } else if (error.code === 2) {
        console.log('La ubicación no está disponible.');
      } else if (error.code === 3) {
        console.log('Tiempo de espera agotado al obtener la ubicación.');
      } else {
        console.log('Error desconocido al obtener la ubicación.');
      }
     });
    const loginInfo = {
      latitud: this.latitud,
      longitud: this.longitud
    };
    console.log("HAGO EL POST lat: "+this.latitud+"    lon: "+this.longitud+"   email2: "+this.email);
    console.log(this.email);
    return await this.http.post(this.URL_API +"/postUbi/"+this.email, loginInfo);
  }



  //NOSE SI LAS LLAMADAS VAN ADENTRO DEL SCHEDULE
  notificarDos() {
    console.log("INTERVAL DEL BACKGROUND CORRIENDO");
    console.log("LLAMO A ENVIAR UBICACION");
    this.enviarUbicacion();


  }

  //NOSE SI LAS LLAMADAS VAN ADENTRO DEL SCHEDULE
  notificar() {
    console.log(this.comunicacion.emailUsuario);

    this.enviarUbicacion();
    this.tengoNotificaciones();

  }

  async enviarUbicacion() {
    console.log("AHORA ENVIO LA UBICACION");
    // if (this.latitud !== undefined && this.longitud !== undefined  ) {
    //   await this.ubicacionService.postUbicacion(this.email, this.latitud, this.longitud)
    //     .subscribe(res => {
    //       console.log("Ya me devolvió el RES");
    //       console.log(res);
    //     });
    // } else {
    //   console.error('La latitud o la longitud son indefinidas.');
    // }

    Geolocation.getCurrentPosition().then((geoposition) => {
      console.log("Ya tengo el position actual");
      this.ubicacionService.postUbicacion(this.email!,
        geoposition.coords.latitude, geoposition.coords.longitude)
        .subscribe(res => {
          console.log("Ya me devolvio el RES");
          console.log(res);
        });
    });

  }

  tengoNotificaciones() {
    this.notificacionService.getNotificacionesNoVistas(this.comunicacion.emailUsuario)
      .subscribe(res => {
        console.log(res);
        var notificacionesNoVistas = res as Notificacion[];
        var i: number;
        for (i = 0; i < notificacionesNoVistas.length; i++) {
          this.mostrarNotificacion(notificacionesNoVistas[i].descripcion);
        }
      });
  }

  mostrarNotificacion(mensaje: string) {
    this.localNotifications.schedule({
      title: 'Hola ' + this.comunicacion.emailUsuario,
      text: mensaje,
      trigger: {
        in: 1,
        unit: ELocalNotificationTriggerUnit.SECOND,
      },
    });
  }



}
