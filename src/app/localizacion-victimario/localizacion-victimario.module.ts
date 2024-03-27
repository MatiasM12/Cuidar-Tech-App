import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LocalizacionVictimarioPage } from './localizacion-victimario.page';

const routes: Routes = [
  {
    path: '',
    component: LocalizacionVictimarioPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LocalizacionVictimarioPage]
})
export class LocalizacionVictimarioPageModule {}
