import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';
import { UsuarioService } from 'src/app/services/usuario.service'; // Importa el servicio UsuarioService
import { ComunicacionService } from 'src/app/services/comunicacion/comunicacion.service'; // Importa el servicio ComunicacionService

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LoginPage],
  providers: [UsuarioService, ComunicacionService] // Provee los servicios aquí
})
export class LoginPageModule {}
