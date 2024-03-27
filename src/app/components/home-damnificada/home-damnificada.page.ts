import { Component, OnInit } from '@angular/core';
import { Geoposition } from '@ionic-native/geolocation/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { Router } from '@angular/router';
import { BotonAntipanicoService } from 'src/app/services/boton-antipanico.service';
import { Storage } from '@ionic/storage';
import { LoadingController, ToastController, AlertController, Platform } from '@ionic/angular';
import { ComunicacionService } from 'src/app/services/comunicacion/comunicacion.service';
import { BotonAntipanico } from 'src/app/models/boton-antipanico';


@Component({
  selector: 'app-home-damnificada',
  templateUrl: './home-damnificada.page.html',
  styleUrls: ['./home-damnificada.page.scss'],
})
export class HomeDamnificadaPage implements OnInit {

  lat: number;
  lon: number;

  //Back button
  subscribe: any;

constructor(public geolocation: Geolocation, private ubicacionService: UbicacionService,
    private router: Router, private botonAntipanicoService: BotonAntipanicoService,
    private storage: Storage, public loadingController: LoadingController,
    private toastController: ToastController, private comunicacion: ComunicacionService,
    private alertController: AlertController, private platform: Platform) {
    this.lat = 0; // Inicializando latitud con un valor por defecto
    this.lon = 0; // Inicializando longitud con un valor por defecto
  }

  ngOnInit() {
    //this.watchGeolocation();
  }

  getGeolocation() {
    console.log("ME PIDIO POSITION");
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition) => {
      this.lat = geoposition.coords.latitude;
      this.lon = geoposition.coords.longitude;
      this.ubicacionService.getUbicacionesRestriccion(1).subscribe(res => {console.log(res);});
      console.log("TENGO LAS COORD");
      console.log("LAT " + this.lat);
      this.ubicacionService.postUbicacion(this.comunicacion.emailUsuario,
        this.lat, this.lon);
    });
  }

  watchGeolocation() {
    let watch = this.geolocation.watchPosition({ enableHighAccuracy: true });
    watch.subscribe((data) => {
      if ('coords' in data && 'timestamp' in data) {
        this.lat = data.coords.latitude;
        this.lon = data.coords.longitude;
      } else {
        console.error('El objeto data no tiene la estructura esperada para Geoposition:', data);
      }    
      this.ubicacionService.postUbicacion(this.comunicacion.emailUsuario,
        this.lat, this.lon).subscribe(res => {
        });
    });
  }

  localizarVictimario() {
    this.router.navigate(["/restricciones-localizables"]);
  }

  async alertar() {
    await this.showLoader("Enviando alerta a contactos...");
    //GENERO EL OBJETO A GUARDAR DE BOTON ANTIPANICO
    let botonAntipanico: BotonAntipanico = new BotonAntipanico;

    botonAntipanico.latitud = this.lat;
    botonAntipanico.longitud = this.lon;

    this.storage.get('persona').then((email) => {
      this.botonAntipanicoService.alertar(botonAntipanico, email)
        .subscribe(async res => {
          await this.loadingController.dismiss();
          this.presentToast('Alerta enviada a contactos correctamente.');
        });
    });
  }

  //ABRE CUADRO DE CARGA
  async showLoader(mensaje: string) {
    const loading = await this.loadingController.create({
      spinner: "lines-small",
      message: mensaje,
      backdropDismiss: false,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

  //ABRE TOIAST CON MENSAJE
  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  //CONFIRMACION DE BOTON ANTIPANICO
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: '¿Dese activar el botón antipánico?',
      buttons: [
        {
          text: 'Aceptar',
          cssClass: 'secondary',
          handler: (blah) => {
            this.alertar();
          }
        },
        {
          text: 'Cancelar',
          handler: () => {
          }
        }

      ]
    });

    await alert.present();
  }


}
