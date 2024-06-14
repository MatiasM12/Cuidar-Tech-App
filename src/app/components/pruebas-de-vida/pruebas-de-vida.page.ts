import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { PersonaService } from 'src/app/services/persona.service';
import { Persona } from 'src/app/models/persona';

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
  estadoGrupo: string = 'Pendiente'
  idGrupoSeleccionado: number = 0;

  constructor(
    public loadingController: LoadingController,
    private alertController: AlertController,
    private pruebaDeVidaService: PruebaDeVidaService,
    private pruebaDeVidaMultipleService: PruebaDeVidaMultipleService, // Inyectar el nuevo servicio
    private usuarioService: UsuarioService,
    private camara: Camera,
    private fotoPruebaDeVidaService: FotoPruebaDeVidaService,
    private personaService: PersonaService,
    private cdr: ChangeDetectorRef ,
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
      this.pruebaDeVidaService.getPruebasDeVidaSimples(emailPersona).subscribe(async pruebasPersona => {
        await this.loadingController.dismiss();
        this.pruebasDeVida = pruebasPersona as PruebaDeVida[];
        this.filtrarPruebasDeVida();
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
          (this.filtroEstado === 'Pendiente' && (prueba.estado === 'Pendiente' || prueba.estado === 'Procesando')) ||
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
    var idPersona = 0
    await this.personaService.getPersonaByIdUsuario(this.usuario.idUsuario).subscribe(async (res)=>{
      let persona = res as Persona; 
      idPersona = persona.idPersona
      await this.showLoader();
      this.pruebaDeVidaMultipleService.getPruebasDeVidaMultiples(idPersona).subscribe(async pruebasMultiples => {
        await this.loadingController.dismiss();
        this.pruebasDeVidaMultiple = pruebasMultiples as PruebaDeVidaMultiple[];
        this.pruebasDeVidaMultiple.reverse();
        this.filtrarPruebasDeVida();
        if (this.pruebasDeVida.length == 0) {
          this.hayPruebasDeVida = false;
        }
        
      });
    })
    
  }

  responderPruebaDeVida(pruebaDeVida: PruebaDeVida) {
    if (pruebaDeVida.estado === 'Rechazada' || pruebaDeVida.estado === 'RechazadaAutomaticamente' || pruebaDeVida.estado === 'Aceptada' || pruebaDeVida.estado === 'AceptadaAutomaticamente') {
      this.showAlert("No puede responder esta prueba de vida", "Porque ya ha sido " + pruebaDeVida.estado.toLowerCase() + ".", '/pruebas-de-vida');
      return;
    }
    if (pruebaDeVida.estado === 'Procesando') {
      this.showAlert("No puede responder esta prueba de vida", "Porque se esta " + pruebaDeVida.estado.toLowerCase() + ".", '/pruebas-de-vida');
      return;
    }

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camara.DestinationType.DATA_URL,
      encodingType: this.camara.EncodingType.JPEG,
      mediaType: this.camara.MediaType.PICTURE,
      correctOrientation: true
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

  async enviarFoto() {
    console.log("Envio la foto");

    this.fotoPruebaDeVidaService.postFotoPruebaDeVida(this.pruebaSeleccionada.idPruebaDeVida, this.fotoSacada, this.pruebaSeleccionada.accion, this.usuario.idUsuario, this.pruebaSeleccionada.idPersonaRestriccion).subscribe(async (res: any) => {
      console.log(this.fotoSacada);
      console.log("PRUEBA ENVIADA");
    }, async error => {
      // En caso de error al enviar la foto
      console.error('Error al enviar la foto:', error);
    });

    await this.showAlert('Se está validando la prueba', "Se notificará el resultado cuando este listo", '/pruebas-de-vida');
    console.log("EL ID A RESPONDER ES EL: " + this.pruebaSeleccionada.idPruebaDeVida);
    this.actualizarEstadoPruebaDeVida(this.pruebaSeleccionada)
  }

  async actualizarEstadoPruebaDeVida(pruebaDeVida: PruebaDeVida){
    await this.pruebaDeVidaService.actualizarEstadoAProcesando(pruebaDeVida).subscribe(res => {
      this.obtenerGrupo(this.idGrupoSeleccionado);
    })
  }

  async showAlert(title: string, message: string, url: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [{
        text: 'Continuar',
        handler: () => {
          this.router.navigateByUrl(url);
          this.pruebaDeVidaService.getPruebasDeVida(localStorage.getItem("emailUsuario")!).subscribe(async pruebasPersona => {
            this.pruebasDeVida = pruebasPersona as PruebaDeVida[];
            this.filtrarPruebasDeVida();
            if (this.pruebasDeVida.length == 0) {
              this.hayPruebasDeVida = false;
            }
          });
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

  obtenerGrupo(idPruebaDeVidaMultiple: number){
    this.idGrupoSeleccionado = idPruebaDeVidaMultiple;
    this.pruebaDeVidaService.getPruebaDeVidaByidPruebaDeVidaMultiple(idPruebaDeVidaMultiple).subscribe(res=>{
      this.pruebasGrupo = [...(res as PruebaDeVida[])]; // Reasignar con un nuevo array
      this.verificarEstadoDePruebaDeVidaMultiples(this.pruebasGrupo);
      this.cdr.detectChanges(); // Forzar la detección de cambios
    });
  }
  

  verificarEstadoDePruebaDeVidaMultiples(pruebasDeVida:PruebaDeVida[]){
    let countAceptadas = 0;
    let countRechazadas = 0;
    this.estadoGrupo = 'Pendiente'
    let idPruebaMultiple = 0
    pruebasDeVida.forEach(prueba =>{
      idPruebaMultiple = prueba.idPruebaDeVidaMultiple;
      if(prueba.estado == 'Aceptada' || prueba.estado == 'AceptadaAutomaticamente')
        countAceptadas++
      if(prueba.estado == 'Rechazada' || prueba.estado == 'RechazadaAutomaticamente')
        countRechazadas++
    })
    if(countAceptadas == pruebasDeVida.length)
      this.estadoGrupo = 'Aceptada'
    if(countRechazadas > 0)
      this.estadoGrupo = 'Rechazada'

    this.pruebaDeVidaMultipleService.actualizarEstadoPruebaDeVida(idPruebaMultiple,this.estadoGrupo).subscribe(res=>{})
  }

  getEstadoIcon(estado: string): string {
    if (estado === 'Rechazada' || estado === 'RechazadaAutomaticamente') {
      return 'close-circle';
    } else if (estado === 'Aceptada' || estado === 'AceptadaAutomaticamente') {
      return 'checkmark-circle';
    } else if (estado === 'Procesando') {
      return 'hourglass';
    } else {
      return 'time';
    }
  }
  
  getEstadoClass(estado: string): string {
    if (estado === 'Rechazada' || estado === 'RechazadaAutomaticamente') {
      return 'estado-rechazada';
    } else if (estado === 'Aceptada' || estado === 'AceptadaAutomaticamente') {
      return 'estado-exitosa';
    } else if (estado === 'Procesando') {
      return 'estado-procesando';
    } else {
      return 'estado-pendiente';
    }
  }
  
}
