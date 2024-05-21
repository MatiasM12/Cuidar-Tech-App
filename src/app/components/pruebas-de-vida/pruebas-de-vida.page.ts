import { Component, OnInit } from '@angular/core';
import { PruebaDeVida } from 'src/app/models/prueba-de-vida';
import { LoadingController, Platform, AlertController  } from '@ionic/angular';
import { PruebaDeVidaService } from 'src/app/services/prueba-de-vida.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FotoPruebaDeVidaService } from 'src/app/services/foto-prueba-de-vida.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';

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
  usuario : Usuario = new Usuario;

  

  constructor(
    public loadingController: LoadingController,
    private alertController: AlertController,
    private pruebaDeVidaService: PruebaDeVidaService,
    private usuarioService: UsuarioService,
    private camara: Camera,
    private fotoPruebaDeVidaService: FotoPruebaDeVidaService,
    private platform: Platform,
    private router: Router) { this.pruebaSeleccionada = new PruebaDeVida();}

  async ngOnInit() {
     this.cargarPruebasDeVida();
     this.usuarioService.getByEmail(localStorage.getItem("emailUsuario")!).subscribe(async res =>{
     this.usuario = res as Usuario;
    })
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
    this.camara.getPicture(options).then(async (imageData) => {
      console.log("SAQUE FOTO");
      this.fotoSacada = 'data:image/png;base64,' + imageData;
      console.log("STRING DE FOTO: ");
      await this.enviarFoto();
    }, (err) => {
      // Handle error
      console.log("Error en la camara: " + err);
    });

  }
  enviarFoto() {
    console.log("Envio la foto");
 
    this.fotoPruebaDeVidaService.postFotoPruebaDeVida(this.pruebaSeleccionada.idPruebaDeVida, this.fotoSacada, this.pruebaSeleccionada.accion, this.usuario.idUsuario).subscribe(async (res: any) => {
        console.log(this.fotoSacada);
        console.log("PRUEBA ENVIADA");
      }, async error => {
        // En caso de error al enviar la foto
        console.error('Error al enviar la foto:', error);
      });
    
    this.showAlert("Se notificará el resultado cuando este listo", '/home-damnificada');  
    console.log("EL ID A RESPONDER ES EL: " + this.pruebaSeleccionada.idPruebaDeVida);
  }
  
  
  async showAlert(message:string,url:string){
    const alert = await this.alertController.create({
      header: 'Se esta validando la prueba',
      message: message, 
      buttons: [ {
        text: 'Continuar',
        handler: () => {
          this.router.navigateByUrl(url);
        },
      },]
    });

    await alert.present();
  }


  async showLoader() {
    this.loaderToShow = await this.loadingController.create({
      message: 'Cargando solicitudes de prueba de vida'
    }).then(async(res) => {
      await res.present();
    });
  }

}
