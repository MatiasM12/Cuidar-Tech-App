import { Component } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Geoposition } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@capacitor/status-bar';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import { ComunicacionService } from './services/comunicacion/comunicacion.service';
import { UbicacionService } from './services/ubicacion.service';
import { NotificacionService } from './services/notificacion.service';
import { Notificacion } from './models/notificacion';
import { ForegroundService } from '@ionic-native/foreground-service/ngx';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Http } from '@capacitor-community/http';
import { CapacitorHttp } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private backgroundMode: BackgroundMode,
    private comunicacion: ComunicacionService,
    private ubicacionService: UbicacionService,
    private notificacionService: NotificacionService,
    public geolocation: Geolocation,
    private foregroundService: ForegroundService,
    private http: HttpClient,
    private storage: Storage
  ) {
    StatusBar.setBackgroundColor({ color: '#3498DB' });

    this.email = "victima1@victima1.com"
    this.initializeApp();
    setInterval(()=> this.mostrarNotificacion(),50000)
  }

  private latitud: number | undefined; // O el tipo de dato que corresponda
  private longitud: number | undefined; // O el tipo de dato que corresponda

  private contador = 0;
  readonly URL_API = 'http://192.168.0.18:9090/Ubicacion';
  private email = localStorage.getItem("emailUsuario")


  async initializeApp() {
    await this.storage.create();
    this.platform.ready().then(() => {

      this.foregroundService.start('GPS Running', 'Background Service');
      setInterval(() => this.notificar(), 20000);
      StatusBar.setBackgroundColor({ color: '#3880ff' });
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

        setInterval(async () => await this.hagoElPost(), 10000);
        setInterval(() => console.log("Hora " + (new Date()).toUTCString()), 10000);
      });

      this.backgroundMode.disableBatteryOptimizations();
      this.backgroundMode.overrideBackButton();
      this.backgroundMode.excludeFromTaskList();
      setInterval(() => this.notificarDos(), 10000);
      this.backgroundMode.enable();

    });

    this.platform.pause.subscribe(async () => {
      console.log("estoy en Segundo planooooooooooooooooooooooooooooooooooooooooooooooo");
      this.foregroundService.start('GPS Running', 'Background Service');
      setInterval(() => this.notificar(), 20000);
      StatusBar.setBackgroundColor({ color: '#3880ff' });
      this.splashScreen.hide();



      setInterval(async () => await this.hagoElPost(), 10000);
      setInterval(() => console.log("Hora " + (new Date()).toUTCString()), 10000);

    });
  }

  async hagoElPost() {
    console.log("Interval de 10 segs");
    // let location = await Geolocation.getCurrentPosition();

    // this.latitud = location.coords.latitude;
    // this.longitud = location.coords.longitude;
    
    // const data = {
    //   latitud: this.latitud,
    //   longitud: this.longitud
    // };
    // const emailUsuario = 'victima1@victima1.com'; 

    // // Configuración de la solicitud HTTP
    // const options = {
    //   url: `${this.URL_API}/postUbi/${emailUsuario}`, 
    //   headers: {
    //     'Content-Type': 'application/json' 
    //   },
    //   data: JSON.stringify(data) 
    // };

    // console.log("HAGO EL POST CON HTTP NATIVO 2 --------------------- lat: " + this.latitud + "    lon: " + this.longitud + "   email2: " + emailUsuario);
    // console.log(emailUsuario);

    // // Realiza la solicitud HTTP usando Http
    // await Http.request({
    //   method: "POST",
    //   url: `${this.URL_API}/postUbi/${emailUsuario}`, 
    //   headers: {
    //     'Content-Type': 'application/json' 
    //   },
    //   data: {
    //     location: JSON.stringify(data),
    //   }
    // });


  }


  //NOSE SI LAS LLAMADAS VAN ADENTRO DEL SCHEDULE
  notificarDos() {
    console.log("INTERVAL DEL BACKGROUND CORRIENDO");
    console.log("LLAMO A ENVIAR UBICACION");
    this.enviarUbicacion();
    this.mostrarNotificacion();


  }

  //NOSE SI LAS LLAMADAS VAN ADENTRO DEL SCHEDULE
  async notificar() {
    console.log(this.comunicacion.emailUsuario);

    this.enviarUbicacion();
    this.mostrarNotificacion();

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

    let location = await Geolocation.getCurrentPosition();

    this.latitud = location.coords.latitude;
    this.longitud = location.coords.longitude;
    
    const data = {
      latitud: this.latitud,
      longitud: this.longitud
    };
    const emailUsuario = 'victima1@victima1.com'; 

    // Configuración de la solicitud HTTP
    const options = {
      url: `${this.URL_API}/postUbi/${emailUsuario}`, 
      headers: {
        'Content-Type': 'application/json' 
      },
      data: JSON.stringify(data) 
    };

    console.log("HAGO EL POST CON HTTP NATIVO 1 --------------------- lat: " + this.latitud + "    lon: " + this.longitud + "   email2: " + emailUsuario);
    console.log(emailUsuario);


    // Realiza la solicitud HTTP usando Http
      await CapacitorHttp.post(options);

    //this.http.post(`${this.URL_API}/postUbi/${emailUsuario}`,data)

  }

  // tengoNotificaciones() {
  //   this.notificacionService.getNotificacionesNoVistas(this.comunicacion.emailUsuario)
  //     .subscribe(res => {
  //       console.log(res);
  //       var notificacionesNoVistas = res as Notificacion[];
  //       var i: number;
  //       for (i = 0; i < notificacionesNoVistas.length; i++) {
  //         this.mostrarNotificacion(notificacionesNoVistas[i].descripcion);
  //       }
  //     });
  // }

  mostrarNotificacion() {
    LocalNotifications.schedule({
      notifications: [
        {
          title: "Ubicacion en segundo plano",
          body: "La aplicacion esta usando la ubicacion en segundo plano",
          ongoing: true,
          id: 1
        }
      ]
    });
  }



}




