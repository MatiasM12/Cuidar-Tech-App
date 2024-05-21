import { Component, OnInit } from '@angular/core';
import { PruebaDeVida } from 'src/app/models/prueba-de-vida';
import { LoadingController, Platform } from '@ionic/angular';
import { PruebaDeVidaService } from 'src/app/services/prueba-de-vida.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FotoPruebaDeVidaService } from 'src/app/services/foto-prueba-de-vida.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import { Usuario } from 'src/app/models/usuario';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home-victimario',
  templateUrl: './home-victimario.page.html',
  styleUrls: ['./home-victimario.page.scss'],
})
export class HomeVictimarioPage implements OnInit {

  loaderToShow: any;
  pruebasDeVida: PruebaDeVida[] = [];
  hayPruebasDeVida = true;
  fotoSacada: any;
  pruebaSeleccionada: PruebaDeVida;

  //Back button
  subscribe: any;

  constructor(
    public loadingController: LoadingController,
    private pruebaDeVidaService: PruebaDeVidaService,
    private camara: Camera,
    private fotoPruebaDeVidaService: FotoPruebaDeVidaService,
    private router: Router,
    private storage: Storage,
    private platform: Platform,
    private backgroundMode: BackgroundMode,
    private localNotifications: LocalNotifications)
  {this.pruebaSeleccionada = new PruebaDeVida();}

  ngOnInit() {
  }

  async showLoader() {
    this.loaderToShow = await this.loadingController.create({
      message: 'Cargando solicitudes de prueba de vida'
    }).then(async (res) => {
      await res.present();
    });
  }

  cerrarSesion(){
    localStorage.setItem('emailUsuario', '');
    this.storage.set('usuario', new Usuario);
    this.backgroundMode.disable();
    this.router.navigate(["/login"]);
  }

}
