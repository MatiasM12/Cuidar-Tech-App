import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocalizacionComisariasPagePageRoutingModule } from './localizacion-comisarias-page-routing.module';

import { LocalizacionComisariasPagePage } from './localizacion-comisarias-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocalizacionComisariasPagePageRoutingModule
  ],
  declarations: [LocalizacionComisariasPagePage]
})
export class LocalizacionComisariasPagePageModule {}
