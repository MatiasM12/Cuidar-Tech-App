import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocalizacionComisariasPagePage } from './localizacion-comisarias-page.page';

const routes: Routes = [
  {
    path: '',
    component: LocalizacionComisariasPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocalizacionComisariasPagePageRoutingModule {}
