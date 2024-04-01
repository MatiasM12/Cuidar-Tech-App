import { Component, OnInit } from '@angular/core';
import OlMap from 'ol/Map';
import OlXYZ from 'ol/source/XYZ';
import OlTileLayer from 'ol/layer/Tile';
import OlView from 'ol/View';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import { Vector as VectorLayer } from 'ol/layer';
import { Icon, Style} from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { ComisariaService } from '../../services/comisaria.service';
import { Comisaria } from '../../models/comisaria';
import TileSource from 'ol/source/Tile';

@Component({
  selector: 'app-localizacion-comisarias-page',
  templateUrl: './localizacion-comisarias-page.page.html',
  styleUrls: ['./localizacion-comisarias-page.page.scss'],
})
export class LocalizacionComisariasPagePage implements OnInit {
 // Variables para el mapa
 map: OlMap = new OlMap(); // Inicializando las propiedades en el constructor
 mapSource: OlXYZ = new OlXYZ();
 capaMapa: OlTileLayer<TileSource> = new OlTileLayer({
   source: this.mapSource
 });
 vistaMapa: OlView = new OlView({
   center: fromLonLat([-58.700233, -34.522249]),
   zoom: 17
 });
 vectorUbicaciones: VectorSource = new VectorSource();
 capaUbicaciones: VectorLayer<VectorSource> = new VectorLayer({
   source: this.vectorUbicaciones
 });
 comisaria : Comisaria = new Comisaria();
 comisarias : Comisaria[] = [];
 intervalo: any;

 constructor(private comisariaService: ComisariaService) { }

 ngOnInit() {
   this.iniciarMapa();
   this.mostrarComisarias();
 }

 iniciarMapa() {
   //Fuente del mapa,
   this.mapSource = new OlXYZ({
     url: 'http://tile.osm.org/{z}/{x}/{y}.png'
   });
 
   //Capa para mostrar el mapa
   this.capaMapa = new OlTileLayer({
     source: this.mapSource
   });

   //Centro el mapa en la UNGS O en cualquier lado
   this.vistaMapa = new OlView({
     center: fromLonLat([-58.700233, -34.522249]),
     zoom: 17
   });

   //Creo el mapa con las capas y la vista
   this.map = new OlMap({
     target: 'map',
     layers: [this.capaMapa],
     view: this.vistaMapa
   });

   setTimeout(() => {
     this.map.updateSize();
   }, 500);    
 }

 
 

 mostrarComisarias() {
  var markerComisaria: Feature;
  
  // Eliminamos las capas anteriores del mapa
  var layers = this.map.getLayers().getArray();
  for (var i = layers.length - 1; i >= 1; --i) {
    var layer = layers[i];
    this.map.removeLayer(layer); 
  }

  // Creamos el vector y la capa para mostrar las ubicaciones
  this.vectorUbicaciones = new VectorSource();
  this.capaUbicaciones = new VectorLayer({
    source: this.vectorUbicaciones
  }); 

  var lon: number
  var lat: number
  this.comisariaService.getComisaria().subscribe(res => {
    this.comisarias = res as Comisaria[];
    
    this.comisarias.forEach(comisaria => {
      lon = +comisaria.coordenadaX;
      lat = +comisaria.coordenadaY;
      console.log(lat, lon);
      
      // Marco las ubicaciones en el mapa
      markerComisaria = new Feature({
        geometry: new Point(fromLonLat([lat, lon]))
      });
      markerComisaria.setStyle(new Style({
        image: new Icon({
          src: 'assets/markerComisaria.png',
          size: [60, 60] // Tamaño de la imagen del icono
        })
      }));
      
      this.vectorUbicaciones.addFeature(markerComisaria);
    });

    // Centramos el mapa en la ubicación de la ultima comisaria (aca deberia centrar el mapa cerca de la dagnificada)
    this.vistaMapa.setCenter(fromLonLat([lat, lon]));
    this.map.addLayer(this.capaUbicaciones);
  });
}

 
}

