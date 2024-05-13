import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Contacto } from 'src/app/models/contacto';
import { ContactoService } from 'src/app/services/contacto.service';
import { Storage } from '@ionic/storage';
import { LoadingController, AlertController } from '@ionic/angular';
//import { ChangeDetectorRef } from '@angular/core';
import { ComunicacionService } from 'src/app/services/comunicacion/comunicacion.service';

@Component({
  selector: 'app-gestionar-contactos',
  templateUrl: './gestionar-contactos.page.html',
  styleUrls: ['./gestionar-contactos.page.scss'],
})
export class GestionarContactosPage implements OnInit {

  contactos: Contacto[] = [];
  loaderToShow: any;

  constructor(private router: Router, private contactoService: ContactoService,
    private storage: Storage, public loadingController: LoadingController,
    private comunicacionService: ComunicacionService, private alertController: AlertController) {
    }

  ngOnInit() { }

  //EVENTO IONIC QUE EJECUTA METODO CADA VEZ QUE SE INGRESA A LA PAG
  ionViewDidEnter(){
    this.getContactos();
  }

  async getContactos(){
    await this.showLoader("Cargando contactos...");
    this.storage.get('persona').then(async (email) => {
      this.contactoService.getContacto(email)
      .subscribe(async res => {
        console.log(res);  
        
        await this.loadingController.dismiss();
        this.contactos = res as Contacto[];
      });
    });
  }

  eliminarContacto(contacto: Contacto){
    this.showLoader("Eliminando contacto...");
    this.contactoService.deleteContacto(contacto.idContacto)
    .subscribe(async res => {
      await this.loadingController.dismiss();
      this.getContactos();
    })
  }

  //ABRE CUADRO DE ESPERA
  async showLoader(mensaje: string) {
    const loading = await this.loadingController.create({
      spinner: "lines-small",
      message: mensaje,
      backdropDismiss: false,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

  abrirContacto(contacto: Contacto){
    this.comunicacionService.enviarContacto(contacto);
  }

  agregarContacto(){
    this.comunicacionService.contacto = new Contacto;
    this.router.navigate(["/agregar-contacto"]);
  }

  async presentAlertConfirm(contacto: Contacto) {
    const alert = await this.alertController.create({
      header: '¿Qué operación desea realizar?',
      buttons: [
        {
          text: 'Editar',
          cssClass: 'secondary',
          handler: (blah) => {
            this.comunicacionService.enviarContacto(contacto);
            this.router.navigate(["/agregar-contacto"]);
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.eliminarContacto(contacto);
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
