import { Component, OnInit } from '@angular/core';
import OlMap from 'ol/Map';
import OlXYZ from 'ol/source/XYZ';
import OlTileLayer from 'ol/layer/Tile';
import OlView from 'ol/View';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import { Vector as VectorLayer } from 'ol/layer';
import { Icon, Style, Stroke, Fill } from 'ol/style';
import { Circle } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { UbicacionService } from '../services/ubicacion.service';
import { ComunicacionService } from '../services/comunicacion/comunicacion.service';
import { Ubicacion } from '../models/ubicacion';
import { UbicacionDTO } from '../models/ubicacion-dto';
import TileSource from 'ol/source/Tile'; // Importa la clase TileSource

@Component({
  selector: 'app-localizacion-victimario',
  templateUrl: './localizacion-victimario.page.html',
  styleUrls: ['./localizacion-victimario.page.scss'],
})
export class LocalizacionVictimarioPage implements OnInit {
 
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
  ubicacionVictimario: Ubicacion = new Ubicacion();
  ubicacionDamnificada: Ubicacion = new Ubicacion();
  ubicacionDto: UbicacionDTO = new UbicacionDTO();
  intervalo: any;

  constructor(private ubicacionService: UbicacionService, private comunicacion: ComunicacionService) { }

  ngOnInit() {
    this.iniciarMapa();
    this.mostrarRestriccion();
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

  
  

  mostrarRestriccion() {
    var markerVictimario: Feature;
    var markerDamnificada: Feature;
    var perimetro: Feature;

    // Obtenemos la restricción DTO de la comunicación
    const restriccionDTO = this.comunicacion.restriccionDTO;
    if (restriccionDTO !== null && restriccionDTO !== undefined) {
      // Si la restricción DTO no es nula, realizamos la llamada al servicio
      this.ubicacionService.getUbicacionesRestriccion(restriccionDTO.restriccion.idRestriccion)
        .subscribe(res => {
          this.ubicacionDto = res as UbicacionDTO;
          this.ubicacionDamnificada = this.ubicacionDto.ubicacionDamnificada;
          this.ubicacionVictimario = this.ubicacionDto.ubicacionVictimario;

          // Marco las ubicaciones en el mapa
          markerVictimario = new Feature({
            geometry: new Point(fromLonLat([this.ubicacionVictimario.longitud, this.ubicacionVictimario.latitud]))
          });
          markerVictimario.setStyle(new Style({
            image: new Icon({
              src: 'assets/markerVictimario.png',
              size: [60, 60] // Tamaño de la imagen del icono
            })
          }));

          markerDamnificada = new Feature({
            geometry: new Point(fromLonLat([this.ubicacionDamnificada.longitud, this.ubicacionDamnificada.latitud]))
          });
          markerDamnificada.setStyle(new Style({
            image: new Icon({
              src: 'assets/markerDamnificada.png',
              size: [60, 60] // Tamaño de la imagen del icono
            })
          }));

          // Dibujamos el círculo y aplicamos el estilo
          perimetro = new Feature();
          var forma = new Circle(fromLonLat([this.ubicacionDamnificada.longitud, this.ubicacionDamnificada.latitud]));
          
          // Verificamos si la distancia es nula antes de establecer el radio del círculo
          if (restriccionDTO.restriccion.distancia !== null && restriccionDTO.restriccion.distancia !== undefined) {
            forma.setRadius(restriccionDTO.restriccion.distancia);
          } else {
            console.error("La propiedad distancia de restriccionDTO.restriccion es nula");
          }

          perimetro.setGeometry(forma);
          this.pintarPerimetro(perimetro);

          // Eliminamos las capas anteriores del mapa
          var layers = this.map.getLayers().getArray();
          for (var i = layers.length - 1; i >= 1; --i) {
            var layer = layers[i];
            this.map.removeLayer(layer);
          }

          // Creamos el vector y la capa para mostrar las ubicaciones
          this.vectorUbicaciones = new VectorSource({
            features: [markerVictimario, markerDamnificada, perimetro]
          });
          this.capaUbicaciones = new VectorLayer({
            source: this.vectorUbicaciones
          });

          // Centramos el mapa en la ubicación de la damnificada y añadimos la capa
          this.vistaMapa.setCenter(fromLonLat([this.ubicacionDamnificada.longitud, this.ubicacionDamnificada.latitud]));
          this.map.addLayer(this.capaUbicaciones);
        });
    } else {
      console.error("La propiedad restriccionDTO de comunicacionService es nula o indefinida.");
    }
  }


  pintarPerimetro(perimetro: Feature) {
    // Pinto el perímetro dependiendo si infringe o no
    const style = new Style({ fill: new Fill({}) });
    let restriccionDTO = this.comunicacion.restriccionDTO;
    if(restriccionDTO !== null)
    this.ubicacionService.getEstaInfringiendo(restriccionDTO.restriccion.idRestriccion, this.ubicacionDto)
      .subscribe(res => {
        const estaInfringiendo = res as boolean;
        if (estaInfringiendo) {
          const fill = style.getFill();
          if (fill !== null) {
            fill.setColor([255, 0, 0, .4]);
            perimetro.setStyle(style);
          } else {
            console.error("El objeto Fill es nulo");
          }
        } else {
          const fill = style.getFill();
          if (fill !== null) {
            fill.setColor([0, 255, 0, .4]);
            perimetro.setStyle(style);
          } else {
            console.error("El objeto Fill es nulo");
          }
        }
      });
  }
  



}