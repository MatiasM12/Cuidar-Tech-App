import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Contacto } from 'src/app/models/contacto';
import { Router } from '@angular/router';
import { PickerController } from '@ionic/angular';
import { ContactoService } from 'src/app/services/contacto.service';
import { Storage } from '@ionic/storage';
import { ComunicacionService } from 'src/app/services/comunicacion/comunicacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { PersonaService } from 'src/app/services/persona.service';
import { Usuario } from 'src/app/models/usuario';
import { Persona } from 'src/app/models/persona';

@Component({
  selector: 'app-agregar-contacto',
  templateUrl: './agregar-contacto.page.html',
  styleUrls: ['./agregar-contacto.page.scss'],
})
export class AgregarContactoPage implements OnInit {

  contacto: Contacto = new Contacto;
  loaderToShow: any;

  constructor(private toastController: ToastController, public loadingController: LoadingController,
    private router: Router, public pickerCtrl: PickerController, private contactoService: ContactoService,
    private storage: Storage, private comunicacionService: ComunicacionService, private usuarioService: UsuarioService,
    private personaService: PersonaService) { }

  ngOnInit() {
    let contacto = this.comunicacionService.contacto;
    if(contacto !== null)
      this.contacto = contacto;
  }

  agregarContacto(contactoForm: NgForm) {
    if(contactoForm.invalid){
      this.presentToast('Falta completar campos');
    }
    else{
      this.showLoader("Agregando contacto...");
      this.contacto.apellido = contactoForm.value.apellido;
      this.contacto.nombre = contactoForm.value.nombre;
      this.contacto.email = contactoForm.value.email;
      this.contacto.telefono = contactoForm.value.telefono;
      this.contacto.relacion = contactoForm.value.relacion;
      this.storage.get("persona").then( email =>{
        this.usuarioService.getByEmail(email).subscribe( res =>{
          let usuario = res as Usuario
          this.personaService.getPersonaByIdUsuario(usuario.idUsuario).subscribe(res=>{
            this.contacto.idDamnificada = (res as Persona).idPersona;
            this.contactoService.postContacto(this.contacto)
              .subscribe(res => {
                this.loadingController.dismiss();
                this.presentToast('Contacto agregado correctamente.');
                contactoForm.reset();
                this.router.navigate(["/gestionar-contactos"]);
                this.contacto = new Contacto;
                this.comunicacionService.contacto = new Contacto;
              });
          })
        })
      })
    
    }
  }

  //ABRE TOIAST CON MENSAJE
  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  //ABRE EL PICKER PARA SELECCIONAR RELACIÓN
  async openPicker() {
    const picker = await this.pickerCtrl.create({
      buttons: [{
        text: 'Guardar',
      }],
      columns: [
        {
          name: 'relacion',
          options: [
            {
              text: 'Padre/Madre',
              value: 1
            },
            {
              text: 'Hermano/a',
              value: 2
            },
            {
              text: 'Otro familiar',
              value: 3
            },
            {
              text: 'Amigo/a',
              value: 4
            },
            {
              text: 'Compañero de trabajo/estudio',
              value: 5
            },
            {
              text: 'Otro',
              value: 6
            }
          ]
        }
      ]
    });
    await picker.present();
    picker.onDidDismiss().then(async data => {
      let col = await picker.getColumn('relacion');
      if (col) {
        let selectedIndex = col.selectedIndex;
        if (selectedIndex !== undefined ) {
          let relacion = col.options[selectedIndex].text;
          if(relacion  !== undefined)
            this.contacto.relacion = relacion;
        }
      }
    });
    
  }

  //ABRE CUADRO DE ESPERA
  showLoader(mensaje: string) {
    this.loaderToShow = this.loadingController.create({
      message: mensaje
    }).then((res) => {
      res.present();
    });
  }

}
