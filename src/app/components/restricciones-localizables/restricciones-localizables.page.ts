import { Component, OnInit } from '@angular/core';
import { ComunicacionService } from 'src/app/services/comunicacion/comunicacion.service';
import { RestriccionDTO } from 'src/app/models/restriccion-dto';
import { RestriccionService } from 'src/app/services/restriccion.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restricciones-localizables',
  templateUrl: './restricciones-localizables.page.html',
  styleUrls: ['./restricciones-localizables.page.scss'],
})
export class RestriccionesLocalizablesPage implements OnInit {

  hayRestricciones = true;
  restricciones: RestriccionDTO[] = [];
  loaderToShow: any;

  constructor(public comunicacion: ComunicacionService, private restriccionService: RestriccionService,
    public loadingController: LoadingController, private router: Router) { }

  ngOnInit() {
    this.cargarRestricciones();
  }

  cargarRestricciones() {
    let emailUsuario = localStorage.getItem("emailUsuario")
    if (emailUsuario != null)
      this.restriccionService.getRestricciones(emailUsuario)
        .subscribe(res => {
          this.restricciones = res as RestriccionDTO[];
          if (this.restricciones.length == 0)
            this.hayRestricciones = false;
        });
  }

  showLoader() {
    this.loaderToShow = this.loadingController.create({
      message: 'Cargando restricciones'
    }).then((res) => {
      res.present();
    });
  }

  seleccionarRestriccion(restriccion: RestriccionDTO) {
    this.comunicacion.enviarRestriccion(restriccion);
    let thisjr = this;
    //IF PUEDO LOCALIZARLO
    this.router.navigate(["/localizacion-victimario"]);
  }

}
