import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  usuario: Usuario = new Usuario;

  listaDamnificada= [
    {
      titulo:'Localizar victimario',
      icon: 'locate',
      url: '/restricciones-localizables'
    },
    {
      titulo:'Gestionar contactos',
      icon: 'person',
      url: '/gestionar-contactos'
    },
    {
      titulo:'Pruebas de vida',
      icon: 'camera',
      url: '/pruebas-de-vida'
    },
    {
      titulo:'Ver Comisarias',
      icon: 'shield',
      url: '/localizacion-comisarias'
    },
    {
      titulo:'Notificaciones',
      icon: 'notifications',
      url: '/notificaciones'
    }
  ];
  
  constructor(
    private storage: Storage,
    private router: Router,
    private backgroundMode: BackgroundMode) { }

  ngOnInit() {
    this.storage.get('usuario').then((user) => {
      this.usuario = user as Usuario;
    })
  }

  cerrarSesion(){
    localStorage.setItem('emailUsuario', '');
    this.storage.set('usuario', new Usuario);
    this.backgroundMode.disable();
    this.router.navigate(["/login"]);
  }

}
