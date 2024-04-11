import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { NgForm } from '@angular/forms';
import * as sha256 from 'js-sha256'; 
import { Router } from '@angular/router';
import { LoadingController, ToastController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ComunicacionService } from 'src/app/services/comunicacion/comunicacion.service';
 
@Component({
  selector: 'app-login', 
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loaderToShow: any;

  //Back button
  subscribe: any;

  usuarioStorage: Usuario = new Usuario;

  constructor(private usuarioService: UsuarioService, private router: Router,
    public loadingController: LoadingController, public toastController: ToastController,
    private storage: Storage, private platform: Platform, private comunicacion: ComunicacionService)
  { }

  async ngOnInit() {
            if(localStorage.getItem('emailUsuario') != ''){
              const emailUsuario = localStorage.getItem('emailUsuario');
              if (emailUsuario !== null) 
                await this.comunicacion.enviarEmailUsuario(emailUsuario);
              if(localStorage.getItem('rolUsuario')=="DAMNIFICADA"){
                this.router.navigate(["/home-damnificada"]);
              }
              else{
                this.router.navigate(["/home-victimario"]);
              }
            }
            await this.storage.create();
   }

  async ingresar(usuarioForm: NgForm) {
    if (usuarioForm.valid) {
      var mail = usuarioForm.value.email;
      var contrasena = sha256.sha256(usuarioForm.value.password);
      await this.showLoader();
      this.usuarioService.login(mail, contrasena)
        .subscribe(async rolUsuario => {
          await this.loadingController.dismiss();
          this.usuarioStorage.email = mail;
          this.usuarioStorage.rolDeUsuario = rolUsuario as string;
          console.log("DATOS ROL: " + rolUsuario);
          await this.setUsuario(mail);
          if (rolUsuario == "VICTIMARIO") {
            this.router.navigate(["/home-victimario"]);
            await localStorage.setItem('emailUsuario', mail);
            await localStorage.setItem('rolUsuario', "VICTIMARIO")
            await this.storage.set('usuario', this.usuarioStorage);
            await this.comunicacion.enviarEmailUsuario(mail);
          }
          else if (rolUsuario == "DAMNIFICADA") {
            this.router.navigate(["/home-damnificada"]);
            await localStorage.setItem('emailUsuario', mail);
            await localStorage.setItem('rolUsuario', "DAMNIFICADA")
            await this.storage.set('usuario', this.usuarioStorage);
            await this.comunicacion.enviarEmailUsuario(mail);
          }
          else
            this.loginInvalido();
        });
    }
  }

  async showLoader() {
    this.loaderToShow = await this.loadingController.create({
      message: 'Iniciando sesión'
    }).then( (res) => {
       res.present();
    });
  }

  async loginInvalido() {
    const toast = await this.toastController.create({
      header: "Error al iniciar sesión.",
      message: 'Por favor verifique los datos ingresados.',
      duration: 4000,
      color: "danger"
    });
    toast.present();
  }

  async setUsuario(email: string) {
    await this.storage.set('persona', email);
  }

}
