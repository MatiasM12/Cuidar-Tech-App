import { Component, OnInit } from '@angular/core';
import { PruebaDeVida } from 'src/app/models/prueba-de-vida';
import { LoadingController, Platform } from '@ionic/angular';
import { PruebaDeVidaService } from 'src/app/services/prueba-de-vida.service';
import { FotoPruebaDeVidaService } from 'src/app/services/foto-prueba-de-vida.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-pruebas-de-vida',
  templateUrl: './pruebas-de-vida.page.html',
  styleUrls: ['./pruebas-de-vida.page.scss'],
})
export class PruebasDeVidaPage implements OnInit {

  loaderToShow: any;
  pruebasDeVida: PruebaDeVida[] = [];
  hayPruebasDeVida = true;
  fotoSacada: any;
  pruebaSeleccionada: PruebaDeVida;

  constructor(
    public loadingController: LoadingController,
    private pruebaDeVidaService: PruebaDeVidaService,
    private camara: Camera,
    private fotoPruebaDeVidaService: FotoPruebaDeVidaService,
    private platform: Platform) { this.pruebaSeleccionada = new PruebaDeVida();}

  ngOnInit() {
    this.cargarPruebasDeVida();
  }

  async cargarPruebasDeVida() {
    var emailPersona = localStorage.getItem("emailUsuario");
    await this.showLoader();
    if(emailPersona !== null)
    this.pruebaDeVidaService.getPruebasDeVida(emailPersona).subscribe(async pruebasPersona => {
      await this.loadingController.dismiss();
      this.pruebasDeVida = pruebasPersona as PruebaDeVida[];
      if (this.pruebasDeVida.length == 0)
        this.hayPruebasDeVida = false;
    });
    
    console.log("email:"+emailPersona);
  }

  responderPruebaDeVida(pruebaDeVida: PruebaDeVida) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camara.DestinationType.DATA_URL,
      encodingType: this.camara.EncodingType.JPEG,
      mediaType: this.camara.MediaType.PICTURE
    }

    this.pruebaSeleccionada = pruebaDeVida;
    console.log("Saco foto");
    this.camara.getPicture(options).then((imageData) => {
      console.log("SAQUE FOTO");
      this.fotoSacada = 'data:image/png;base64,' + imageData;
      console.log("STRING DE FOTO: ");
      this.enviarFoto();
    }, (err) => {
      // Handle error
      console.log("Error en la camara: " + err);
    });

  }

  enviarFoto() {
    console.log("Envio la foto");
    this.fotoPruebaDeVidaService.postFotoPruebaDeVida(this.pruebaSeleccionada.idPruebaDeVida, this.fotoSacada).subscribe(res => {
      console.log(this.fotoSacada);
      console.log("PRUEBA ENVIADA");
    });
    console.log("EL ID A RESPONDER ES EL: " + this.pruebaSeleccionada.idPruebaDeVida);
  }

  async showLoader() {
    this.loaderToShow = await this.loadingController.create({
      message: 'Cargando solicitudes de prueba de vida'
    }).then(async(res) => {
      await res.present();
    });
  }

}
