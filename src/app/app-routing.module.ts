import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'login', loadChildren: () => import('./components/login/login.module').then(m => m.LoginPageModule) },
  { path: 'home-damnificada', loadChildren: () => import('./components/home-damnificada/home-damnificada.module').then(m => m.HomeDamnificadaPageModule) },
  { path: 'localizacion-victimario', loadChildren: () => import('./localizacion-victimario/localizacion-victimario.module').then(m => m.LocalizacionVictimarioPageModule) },
  { path: 'restricciones-localizables', loadChildren: () => import('./components/restricciones-localizables/restricciones-localizables.module').then(m => m.RestriccionesLocalizablesPageModule) },
  { path: 'gestionar-contactos', loadChildren: () => import('./components/gestionar-contactos/gestionar-contactos.module').then(m => m.GestionarContactosPageModule) },
  { path: 'agregar-contacto', loadChildren: () => import('./components/agregar-contacto/agregar-contacto.module').then(m => m.AgregarContactoPageModule) },
  { path: 'home-victimario', loadChildren: () => import('./components/home-victimario/home-victimario.module').then(m => m.HomeVictimarioPageModule) },
  { path: 'pruebas-de-vida', loadChildren: () => import('./components/pruebas-de-vida/pruebas-de-vida.module').then(m => m.PruebasDeVidaPageModule) },
  { path: 'notificaciones', loadChildren: () => import('./components/notificaciones/notificaciones.module').then(m => m.NotificacionesPageModule) },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
