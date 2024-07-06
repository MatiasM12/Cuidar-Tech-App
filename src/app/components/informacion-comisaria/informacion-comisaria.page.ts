import { Component, OnInit } from '@angular/core';
import { Comisaria } from '../../models/comisaria';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-informacion-comisaria',
  templateUrl: './informacion-comisaria.page.html',
  styleUrls: ['./informacion-comisaria.page.scss'],
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
      }
    }).catch((error) => {
      console.error('Error al recuperar la comisaría del Storage:', error);
    });
  }

  irAGoogleMaps(){
    var googleMapsUrl = 'https://www.google.com/maps/search/' + encodeURIComponent(this.comisaria.nombre);
    window.open(googleMapsUrl);
  }

  obtenerIconoComisaria(tipo: string): string {
    if (tipo === 'MUJER') {
      return './../../../assets/comisaria-de-la-mujer.png';
    } else {
      return './../../../assets/comisaria-de-policia.png';
    }
  }
}
