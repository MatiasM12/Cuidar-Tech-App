import { Component, OnInit } from '@angular/core';
import OlMap from 'ol/Map';
import OlXYZ from 'ol/source/XYZ';
import OlTileLayer from 'ol/layer/Tile';
import OlView from 'ol/View';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import { Vector as VectorLayer } from 'ol/layer';
import { Icon, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { ComisariaService } from '../../services/comisaria.service';
import { Comisaria } from '../../models/comisaria';
import TileSource from 'ol/source/Tile';
import Overlay from 'ol/Overlay';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@capacitor/geolocation';

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
  comisaria: Comisaria = new Comisaria();
  comisarias: Comisaria[] = [];
  intervalo: any;

  constructor(private comisariaService: ComisariaService, private router: Router, private storage: Storage) { }

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

    // Escuchar el evento de cambio de resolución (zoom)
    this.map.getView().on('change:resolution', () => {
       this.mostarNombreComisaria();
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

    var lon: number;
    var lat: number;
    this.comisariaService.getComisaria().subscribe(async res => {
      this.comisarias = res as Comisaria[];

      this.comisarias.forEach(comisaria => {
        lon = +comisaria.coordenadaX;
        lat = +comisaria.coordenadaY;
        console.log(lat, lon);

        // Marco las ubicaciones en el mapa
        markerComisaria = new Feature({
          geometry: new Point(fromLonLat([lat, lon]))
        });

        if(comisaria.tipo == "MUJER"){
          markerComisaria.setStyle(new Style({
            image: new Icon({
              src: '../../../assets/markerComisariaDeLaMujer.png',
              size: [60, 60] // Tamaño de la imagen del icono
            })
          }));
        }else{
          markerComisaria.setStyle(new Style({
            image: new Icon({
              src: '../../../assets/markerComisaria.png',
              size: [60, 60] // Tamaño de la imagen del icono
            })
          }));
        }
       


        // Agregar información debajo del marcador
        var content = `<div style="font-size: 12px; text-align: center;"><strong style="color: blue;"></strong> <span style="font-weight: bold;">${comisaria.nombre}</span></div>` +
          `<div style="font-size: 12px; text-align: center;"><strong style="color: blue;"></strong> <span style="font-weight: bold;">${comisaria.direccion}</span></div>`;

        // Crear un overlay (ventana emergente) para mostrar la información
        var popup = new Overlay({
          element: document.createElement('div'),
          positioning: 'bottom-center',
          offset: [0, +70],
          stopEvent: false
        });

        // Agregar contenido al popup
        var element = popup.getElement();
        if (element) {
          element.innerHTML = content;
          this.map.addOverlay(popup);

          // Mostrar la ventana emergente cuando se hace clic en el marcador
          popup.setPosition(fromLonLat([lat, lon]));

          // Agregar un evento de clic al contenido del popup
          element.addEventListener('click', () => {
            this.storage.set('comisariaSeleccionada', comisaria);
            this.router.navigate(["/info-comisaria"]);
          });
        }
        this.vectorUbicaciones.addFeature(markerComisaria);
      });

      var latitud = 0;
      var longitud = 0;
      await Geolocation.getCurrentPosition().then((res) => {
        let position = res as GeolocationPosition;
        console.log("Ya tengo el position actual");
        latitud = position.coords.latitude;
        longitud = position.coords.longitude;
        // Centramos el mapa en la ubicación actual
        this.vistaMapa.setCenter(fromLonLat([longitud, latitud]));
        this.map.addLayer(this.capaUbicaciones);
      });
      this.mostarNombreComisaria();
    });
  }

  mostarNombreComisaria() {
    const zoomLevel = this.vistaMapa.getZoom();

    // Ocultar o mostrar el contenido adicional según el nivel de zoom
    const overlays = this.map.getOverlays().getArray();
    overlays.forEach((overlay) => {
      const element = overlay.getElement();
      if (element && zoomLevel) {
        const shouldShowContent = zoomLevel >= 14; // Ajusta el nivel de zoom adecuado aquí
        element.style.display = shouldShowContent ? 'block' : 'none';
      }
    });
  }

}