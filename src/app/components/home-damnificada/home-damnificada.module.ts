import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomeDamnificadaPage } from './home-damnificada.page';
import { MenuComponent } from '../menu/menu.component';

const routes: Routes = [
  {
    path: '',
    component: HomeDamnificadaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomeDamnificadaPage, MenuComponent]
})
export class HomeDamnificadaPageModule {}
