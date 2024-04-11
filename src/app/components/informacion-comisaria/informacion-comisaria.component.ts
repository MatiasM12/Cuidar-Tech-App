import { Component, OnInit } from '@angular/core';
import { Comisaria } from '../../models/comisaria';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-informacion-comisaria',
  templateUrl: './informacion-comisaria.component.html',
  styleUrls: ['./informacion-comisaria.component.scss'],
})
export class InformacionComisariaComponent  implements OnInit {
  comisaria: Comisaria= new Comisaria();

  constructor(private storage: Storage ) {}

  ngOnInit() {
    this.obtenerComisaria();
  }

  obtenerComisaria() {
    this.storage.get('comisariaSeleccionada').then((comisaria) => {
      if (comisaria) {
        this.comisaria = comisaria;
      } else {
        console.log('No se encontraron datos de la comisaría en el Storage.');
      }
    }).catch((error) => {
      console.error('Error al recuperar la comisaría del Storage:', error);
    });
  }

  irAGoogleMaps(){
    var googleMapsUrl = 'https://www.google.com/maps/search/' + encodeURIComponent(this.comisaria.nombre);
    window.open(googleMapsUrl);
  }

}
