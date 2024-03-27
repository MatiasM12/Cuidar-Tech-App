import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
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
    this.initializeApp();
  }


  private latitud: number | undefined; // O el tipo de dato que corresponda
  private longitud: number | undefined; // O el tipo de dato que corresponda
  
  private contador = 0;
  readonly URL_API = 'http://localhost:9090/'+'Ubicacion';
  private email = "damnificada2@damnificada.com"




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
        let watch = this.geolocation.watchPosition({ enableHighAccuracy: true });
        watch.subscribe((data) => {
          if ('coords' in data && 'timestamp' in data) {
            this.latitud = data.coords.latitude;
            this.longitud = data.coords.longitude;
          } else {
            console.error('El objeto data no tiene la estructura esperada para Geoposition:', data);
          }          
          
        });
        //setInterval(() => this.hagoElPost(), 10000);
        setInterval(() => console.log("Hora "+(new Date()).toUTCString()), 10000);

      });


      this.backgroundMode.disableBatteryOptimizations();
      this.backgroundMode.overrideBackButton();
      this.backgroundMode.excludeFromTaskList();
      //setInterval(() => this.notificarDos(), 10000);
      this.backgroundMode.enable();

    });
  }

  hagoElPost(){
    console.log("Interval de 10 segs");
    const loginInfo: { latitud?: number, longitud?: number } = {}; // Tipo explícito para loginInfo
    loginInfo["latitud"] = this.latitud;
    loginInfo["longitud"] = this.longitud; 
    console.log("HAGO EL POST lat: "+this.latitud+"    lon: "+this.longitud+"   email: "+this.email);
    console.log(this.http.post(this.URL_API +"/postUbi/"+this.email, loginInfo));
    return this.http.post(this.URL_API +"/postUbi/"+this.email, loginInfo);
  }
  


  //NOSE SI LAS LLAMADAS VAN ADENTRO DEL SCHEDULE
  notificarDos() {
    console.log("INTERVAL DEL BACKGROUND CORRIENDO");
    if (this.comunicacion.emailUsuario != "") {
      console.log("LLAMO A ENVIAR UBICACION");
      this.enviarUbicacion();
      
    }
  }

  //NOSE SI LAS LLAMADAS VAN ADENTRO DEL SCHEDULE
  notificar() {
    console.log(this.comunicacion.emailUsuario);
    if (this.comunicacion.emailUsuario != "") {
      this.enviarUbicacion();
      this.tengoNotificaciones();
    }
  }

  enviarUbicacion() {
    console.log("AHORA ENVIO LA UBICACION");
    if (this.latitud !== undefined && this.longitud !== undefined  ) {
      this.ubicacionService.postUbicacion(this.comunicacion.emailUsuario, this.latitud, this.longitud)
        .subscribe(res => {
          console.log("Ya me devolvió el RES");
          console.log(res);
        });
    } else {
      console.error('La latitud o la longitud son indefinidas.');
    }
  
  
    
    
    
    
    /*
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition) => {
      console.log("Ya tengo el position actual");
      this.ubicacionService.postUbicacion(this.comunicacion.emailUsuario,
        geoposition.coords.latitude, geoposition.coords.longitude)
        .subscribe(res => {
          console.log("Ya me devolvio el RES");
          console.log(res);
        });
    });
    */
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
