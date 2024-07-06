import { Component } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';
import { BackgroundMode } from '@anuradev/capacitor-background-mode';
import { ComunicacionService } from './services/comunicacion/comunicacion.service';
import { UbicacionService } from './services/ubicacion.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent {
  constructor(
    private platform: Platform,
    private comunicacion: ComunicacionService,
    private ubicacionService: UbicacionService,
    public geolocation: Geolocation,
    private storage: Storage
  ) {
    StatusBar.setBackgroundColor({ color: '#480971' });
    this.email = localStorage.getItem("emailUsuario")
    this.initializeApp();
  }

  private latitud: number | undefined; // O el tipo de dato que corresponda
  private longitud: number | undefined; // O el tipo de dato que corresponda

  private email = localStorage.getItem("emailUsuario")


  async initializeApp() {
    await this.storage.create();

    this.platform.ready().then(() => {
      StatusBar.setBackgroundColor({ color: '#480971' });

      BackgroundMode.disableWebViewOptimizations();
      BackgroundMode.setSettings({
        title: "Cuidar tech en segundo plano",
        text: "La aplicacion esta usando la ubicacion en segundo plano, porfavor no cierre la app",
        resume: true,
        hidden: false,
        bigText: true,
        color: "480971",
      })
      BackgroundMode.enable().then(() => {
        BackgroundMode.disableWebViewOptimizations();
        Geolocation.getCurrentPosition().then((resp) => {
          setInterval(() => console.log("Se esta obteniendo la ubicacion correctamente"), 10000);
        }).catch((error) => {
          console.log('Error getting location', error);
        });

        setInterval(async () => await this.notificar(), 10000);
        setInterval(() => console.log("Hora " + (new Date()).toUTCString()), 10000);
      });

      setInterval(() => this.notificar(), 10000);
    });

    this.platform.pause.subscribe(async () => {
      setInterval(() => this.notificar(), 10000);
      setInterval(() => console.log("Hora " + (new Date()).toUTCString()), 10000);
    });
  }


  async notificar() {
    await this.enviarUbicacion();
  }

  async enviarUbicacion() {

    let location = await Geolocation.getCurrentPosition();
    this.latitud = location.coords.latitude;
    this.longitud = location.coords.longitude;

    this.ubicacionService.postUbicacion(this.email!, this.latitud, this.longitud);
  }

}