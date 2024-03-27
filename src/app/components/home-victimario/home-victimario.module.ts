import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomeVictimarioPage } from './home-victimario.page';

const routes: Routes = [
  {
    path: '',
    component: HomeVictimarioPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomeVictimarioPage]
})
export class HomeVictimarioPageModule {}
