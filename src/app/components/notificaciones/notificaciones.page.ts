import { Component, OnInit } from '@angular/core';
import { Notificacion } from 'src/app/models/notificacion';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { ComunicacionService } from 'src/app/services/comunicacion/comunicacion.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {

  notificaciones: Notificacion[] = [];
  loaderToShow: any;
  filtroEstado: string = 'NoVista';


  constructor(
    private notificacionService: NotificacionService,
    public loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,
    private comunicacion: ComunicacionService) { }

  ngOnInit() {
    this.getNotificaciones();
  }

  getNotificaciones() {
    let emailUsuario = localStorage.getItem("emailUsuario");
    if (emailUsuario !== null) {
      this.notificacionService.getNoificaciones(emailUsuario)
        .subscribe(res => {
          this.notificaciones = res as Notificacion[];
          this.notificaciones.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

          // Filtrar las notificaciones según el estado seleccionado
          if (this.filtroEstado != 'Todas')
            this.notificaciones = this.notificaciones.filter(notif => notif.estado === this.filtroEstado);
        });
    }
  }


  async verNotificacion(notificacion: Notificacion) {
    const alert = await this.alertController.create({
      header: notificacion.asunto,
      message: notificacion.descripcion,
      buttons: [
        {
          text: 'Marcar como vista',
          handler: () => {
            this.marcarComoVista(notificacion.idNotificacion);
          }
        },
        {
          text: 'Archivar',
          handler: () => {
            this.archivarNotificacion(notificacion.idNotificacion);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  marcarComoVista(idNotificacion: number) {
    this.notificacionService.marcarComoVista(idNotificacion)
      .subscribe(res => {
        this.getNotificaciones(); // Actualizar la lista de notificaciones
      });
  }

  archivarNotificacion(idNotificacion: number) {
    this.notificacionService.archivarNotificacion(idNotificacion)
      .subscribe(res => {
        this.getNotificaciones(); // Actualizar la lista de notificaciones
      });
  }

  ir() {
    if (localStorage.getItem('rolUsuario') == "DAMNIFICADA") {
      this.router.navigate(["/home-damnificada"]);
    }
    else {
      this.router.navigate(["/home-victimario"]);
    }
  }

  marcarTodasComoVistas() {
    let emailUsuario = localStorage.getItem("emailUsuario");
    if (emailUsuario !== null) {
      this.notificacionService.marcarTodasComoVistas(emailUsuario)
        .subscribe(res => {
          this.getNotificaciones();
        });
    }
  }

}
