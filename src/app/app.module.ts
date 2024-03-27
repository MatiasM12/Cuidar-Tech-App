import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http'; 
import { Geolocation } from '@ionic-native/geolocation/ngx'; 
import { Camera } from '@ionic-native/camera/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ForegroundService } from '@ionic-native/foreground-service/ngx';
import { Platform } from '@ionic/angular';
import { ComunicacionService } from './services/comunicacion/comunicacion.service';
import { UbicacionService } from './services/ubicacion.service';
import { NotificacionService } from './services/notificacion.service';

import { LoginPageModule } from './components/login/login.module';
import { HomeDamnificadaPageModule } from './components/home-damnificada/home-damnificada.module';
import { LocalizacionVictimarioPageModule } from './localizacion-victimario/localizacion-victimario.module';
import { RestriccionesLocalizablesPageModule } from './components/restricciones-localizables/restricciones-localizables.module';
import { GestionarContactosPageModule } from './components/gestionar-contactos/gestionar-contactos.module';
import { AgregarContactoPageModule } from './components/agregar-contacto/agregar-contacto.module';
import { HomeVictimarioPageModule } from './components/home-victimario/home-victimario.module';
import { PruebasDeVidaPageModule } from './components/pruebas-de-vida/pruebas-de-vida.module';
import { NotificacionesPageModule } from './components/notificaciones/notificaciones.module';
import { HomePageModule } from './home/home.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    LoginPageModule,
    HomeDamnificadaPageModule,
    LocalizacionVictimarioPageModule,
    RestriccionesLocalizablesPageModule,
    GestionarContactosPageModule,
    AgregarContactoPageModule,
    HomeVictimarioPageModule,
    PruebasDeVidaPageModule,
    NotificacionesPageModule,
    HomePageModule
  ],
  providers: [
    Platform,
    ComunicacionService,
    UbicacionService,
    NotificacionService,
    BackgroundMode,
    LocalNotifications,
    StatusBar,
    SplashScreen,
    Geolocation,
    Camera,
    ForegroundService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
