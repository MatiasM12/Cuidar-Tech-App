import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RestriccionesLocalizablesPage } from './restricciones-localizables.page';

const routes: Routes = [
  {
    path: '',
    component: RestriccionesLocalizablesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RestriccionesLocalizablesPage]
})
export class RestriccionesLocalizablesPageModule {}
