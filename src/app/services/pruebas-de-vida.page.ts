import { Component, OnInit } from '@angular/core';
import { PruebaDeVida } from 'src/app/models/prueba-de-vida';
import { PruebaDeVidaMultiple } from 'src/app/models/prueba-de-vida-multiple';
import { LoadingController, Platform, AlertController } from '@ionic/angular';
import { PruebaDeVidaService } from 'src/app/services/prueba-de-vida.service';
import { PruebaDeVidaMultipleService } from 'src/app/services/prueba-de-vida-multiple.service'; // Importar el nuevo servicio
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
  pruebasDeVidaMultiple: PruebaDeVidaMultiple[] = [];
  pruebasFiltradas: PruebaDeVida[] = [];
  pruebasGrupo: PruebaDeVida[] = [];
  hayPruebasDeVida = true;
  fotoSacada: any; 
  pruebaSeleccionada: PruebaDeVida;
  usuario: Usuario = new Usuario();
  filtroEstado: string = 'Pendiente';
  filtroTipo: string = 'Simples'; // Nuevo filtro para el tipo de pruebas de vida

  constructor(
    public loadingController: LoadingController,
    private alertController: AlertController,
    private pruebaDeVidaService: PruebaDeVidaService,
    private pruebaDeVidaMultipleService: PruebaDeVidaMultipleService, // Inyectar el nuevo servicio
    private usuarioService: UsuarioService,
    private camara: Camera,
    private fotoPruebaDeVidaService: FotoPruebaDeVidaService,
    private platform: Platform,
    private router: Router) { this.pruebaSeleccionada = new PruebaDeVida(); }

  async ngOnInit() {
    this.cargarPruebasDeVida();
    this.usuarioService.getByEmail(localStorage.getItem("emailUsuario")!).subscribe(async res => {
      this.usuario = res as Usuario;
    });
  }

  async cargarPruebasDeVida() {
    var emailPersona = localStorage.getItem("emailUsuario");
    await this.showLoader();
    if (emailPersona !== null) {
      this.pruebaDeVidaService.getPruebasDeVida(emailPersona).subscribe(async pruebasPersona => {
        this.pruebasDeVida = pruebasPersona as PruebaDeVida[];
        this.filtrarPruebasDeVida();
        await this.loadingController.dismiss();
        if (this.pruebasDeVida.length == 0) {
          this.hayPruebasDeVida = false;
        }
      });
    }
    console.log("email:" + emailPersona);
  }

  filtrarPruebasDeVida(event?: any) {
    if (event) {
      this.filtroEstado = event.detail.value;
    }

    const esMultipleFilter = this.filtroTipo === 'Multiples';

    if (this.filtroEstado === 'Todos') {
      this.pruebasFiltradas = this.pruebasDeVida.filter(prueba => prueba.esMultiple === esMultipleFilter);
    } else {
      // Unificar los términos "Rechazada" y "RechazadaAutomaticamente" en "Rechazada"
      // Unificar los términos "Aceptada" y "AceptadaAutomaticamente" en "Aceptada"
      this.pruebasFiltradas = this.pruebasDeVida.filter(prueba => 
        prueba.esMultiple === esMultipleFilter &&
        (
          (this.filtroEstado === 'Rechazada' && (prueba.estado === 'Rechazada' || prueba.estado === 'RechazadaAutomaticamente')) ||
          (this.filtroEstado === 'Aceptada' && (prueba.estado === 'Aceptada' || prueba.estado === 'AceptadaAutomaticamente')) ||
          prueba.estado === this.filtroEstado
        )
      );
    }
  }

  segmentChanged(event: any) {
    this.filtroTipo = event.detail.value;
    if (this.filtroTipo === 'Multiples') {
      this.cargarPruebasDeVidaMultiples();
    } else {
      this.cargarPruebasDeVida();
    }
  }

  async cargarPruebasDeVidaMultiples() {
    var idPersona = this.pruebaSeleccionada.idPersonaRestriccion; 
    console.log("🚀 ~ PruebasDeVidaPage ~ cargarPruebasDeVidaMultiples ~ idPersona:", idPersona)
    await this.showLoader();
    this.pruebaDeVidaMultipleService.getPruebasDeVidaMultiples(idPersona).subscribe(async pruebasMultiples => {
      await this.loadingController.dismiss();
      this.pruebasDeVidaMultiple = pruebasMultiples as PruebaDeVidaMultiple[];
      this.filtrarPruebasDeVida();
      if (this.pruebasDeVida.length == 0) {
        this.hayPruebasDeVida = false;
      }
    });
  }

  responderPruebaDeVida(pruebaDeVida: PruebaDeVida) {
    if (pruebaDeVida.estado === 'Rechazada' || pruebaDeVida.estado === 'RechazadaAutomaticamente' || pruebaDeVida.estado === 'Aceptada' || pruebaDeVida.estado === 'AceptadaAutomaticamente') {
      this.showAlert("No puede responder esta prueba de vida", "Porque ya ha sido " + pruebaDeVida.estado.toLowerCase() + ".", '/pruebas-de-vida');
      return;
    }

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
      this.fotoSacada = 'data:image/jpg;base64,' + imageData;
      console.log("STRING DE FOTO: ");
      await this.enviarFoto();
    }, (err) => {
      // Handle error
      console.log("Error en la camara: " + err);
    });
  }

  enviarFoto() {
    console.log("Envio la foto");

    this.fotoPruebaDeVidaService.postFotoPruebaDeVida(this.pruebaSeleccionada.idPruebaDeVida, this.fotoSacada, this.pruebaSeleccionada.accion, this.usuario.idUsuario, this.pruebaSeleccionada.idPersonaRestriccion).subscribe(async (res: any) => {
      console.log(this.fotoSacada);
      console.log("PRUEBA ENVIADA");
    }, async error => {
      // En caso de error al enviar la foto
      console.error('Error al enviar la foto:', error);
    });

    this.showAlert('Se está validando la prueba', "Se notificará el resultado cuando este listo", '/home-damnificada');
    console.log("EL ID A RESPONDER ES EL: " + this.pruebaSeleccionada.idPruebaDeVida);
  }

  async showAlert(title: string, message: string, url: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [{
        text: 'Continuar',
        handler: () => {
          this.router.navigateByUrl(url);
        },
      }]
    });

    await alert.present();
  }

  async showLoader() {
    this.loaderToShow = await this.loadingController.create({
      message: 'Cargando solicitudes de prueba de vida'
    }).then(async (res) => {
      await res.present();
    });
  }

  obtenerGrupo(pruebaDeVidaMultiple: PruebaDeVidaMultiple){
    this.pruebaDeVidaService.getPruebaDeVidaByidPruebaDeVidaMultiple(pruebaDeVidaMultiple.idPruebaDeVidaMultiple).subscribe(res=>{
      this.pruebasGrupo = res as PruebaDeVida[]; 
      console.log("🚀 ~ PruebasDeVidaPage ~ this.pruebaDeVidaService.getPruebaDeVidaByidPruebaDeVidaMultiple ~ this.pruebasGrupo:", this.pruebasGrupo)
  })
  }


  getEstadoIcon(estado: string): string {
    if ('Rechazada' == estado || 'RechazadaAutomaticamente' == estado)
      return 'close-circle';
    if ('Aceptada' == estado || 'AceptadaAutomaticamente' == estado)
      return 'checkmark-circle';

    return 'time';

  }

  getEstadoClass(estado: string): string {
    if ('Rechazada' == estado || 'RechazadaAutomaticamente' == estado)
      return 'estado-rechazada';
    if ('Aceptada' == estado || 'AceptadaAutomaticamente' == estado)
      return 'estado-exitosa';

    return 'estado-pendiente';

  }
}
