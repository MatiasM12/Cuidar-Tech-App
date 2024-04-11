import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { InformacionComisariaComponent } from './informacion-comisaria.component';
import { IonicModule } from '@ionic/angular';

const routes: Routes = [
  {
    path: '',
    component: InformacionComisariaComponent
  }
];

@NgModule({
  declarations: [InformacionComisariaComponent],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class InformacionComisariaModule { }
