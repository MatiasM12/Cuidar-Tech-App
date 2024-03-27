import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PruebasDeVidaPage } from './pruebas-de-vida.page';

const routes: Routes = [
  {
    path: '',
    component: PruebasDeVidaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PruebasDeVidaPage]
})
export class PruebasDeVidaPageModule {}
