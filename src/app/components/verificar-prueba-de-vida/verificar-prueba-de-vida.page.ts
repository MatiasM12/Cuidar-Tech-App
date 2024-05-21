import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Category, DrawingUtils, FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { Router } from '@angular/router';
import { AlertController  } from '@ionic/angular';


@Component({
  selector: 'app-verificar-prueba-de-vida',
  templateUrl: './verificar-prueba-de-vida.page.html',
  styleUrls: ['./verificar-prueba-de-vida.page.scss'],
})

export class VerificarPruebaDeVidaPage implements OnInit, AfterViewInit {

  // ML Model and properties (WASM & Model provided by Google, you can place your own).
  faceLandmarker!: FaceLandmarker;
  wasmUrl: string = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";
  modelAssetPath: string = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";
  // Native elements and types we need to interact to later.
  video!: HTMLVideoElement;
  canvasElement!: HTMLCanvasElement;
  canvasCtx!: CanvasRenderingContext2D;
  // A state to toggle functionality.
  tracking: boolean = false;
  // A challenge state for the user.
  userDidBlink: boolean = false;

  // Definir las posibles acciones y títulos correspondientes
  acciones = [
    { nombre: 'Guiño Derecho', atributo: 'eyeBlinkRight', titulo: '¡Has hecho un Guiño Derecho!' },
    { nombre: 'Sonrisa', atributo: 'mouthSmileRight', titulo: '¡Has Sonreído!' },
    { nombre: 'Guiño Izquierdo', atributo: 'eyeBlinkLeft', titulo: '¡Has hecho un Guiño Izquierdo!' },
    { nombre: 'Boca abierta', atributo: 'jawOpen',titulo: '¡Tienes la Boca Abierta!' },
    { nombre: 'Levantar cejas', atributo: 'browInnerUp',titulo: '¡Has Levantado las Cejas!' }
  ];

  // Variable para realizar un seguimiento de las acciones completadas
  accionesCompletadas: { [key: string]: boolean } = {};
  todasAccionesCompletadas: boolean = false;

  constructor(private router: Router,private alertController: AlertController) { }

  async ngOnInit(): Promise<void> {
    this.faceLandmarker = await FaceLandmarker.createFromOptions(await FilesetResolver.forVisionTasks(this.wasmUrl), {
      baseOptions: { modelAssetPath: this.modelAssetPath, delegate: "GPU" },
      outputFaceBlendshapes: false, // We will draw the face mesh in canvas.
      runningMode: "VIDEO",
    }); 
    // Elegir una acción como título inicial
    const accionInicial = this.acciones[0];
    document.getElementById('titulo-accion')!.innerText = accionInicial.nombre;   
    //this.startTracking();
  }

  //Alert cada vez que entra a la pagina
  ionViewDidEnter() {
    //this.startTracking();

    this.presentConfirmationAlert();
  }

  async presentConfirmationAlert() {
    const alert = await this.alertController.create({
      header: 'Validación por video',
      message: 'Estás a punto de iniciar la prueba de reconocimiento por video. ¿Deseas continuar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('El usuario canceló la prueba de reconocimiento por video.');
            this.volverAlInicio();
          },
        },
        {
          text: 'Continuar',
          handler: () => {
            //this.startTracking();
          },
        }, 
      ],
    });

    await alert.present();
  }

  async ngAfterViewInit(): Promise<void> {
    this.video = document.getElementById("user-video") as HTMLVideoElement;
    this.canvasElement = document.getElementById("user-canvas") as HTMLCanvasElement;
    this.canvasCtx = this.canvasElement.getContext("2d") as CanvasRenderingContext2D;
  }

  toggleTracking = () => (this.tracking = !this.tracking, this.tracking ? this.startTracking() : this.stopTracking());

  startTracking() {
    // Check if we can access user media api.
    (!(!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) || !this.faceLandmarker) && (console.warn("user media or ml model is not available"), false);
    // Everything is ready to go!
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => (this.video.srcObject = stream, this.video.addEventListener("loadeddata", predictWebcam)));
    
    let lastVideoTime = -1; let results: any = undefined; const drawingUtils = new DrawingUtils(this.canvasCtx!);
    let predictWebcam = async () => {
      // Resize the canvas to match the video size.
      this.canvasElement.width = this.video.videoWidth; this.canvasElement.height = this.video.videoHeight;
      // Send the video frame to the model.
      lastVideoTime !== this.video.currentTime && (lastVideoTime = this.video.currentTime, results = this.faceLandmarker.detectForVideo(this.video, Date.now()));
      // Draw the results on the canvas (comment this out to improve performance or add even more markers like mouth, etc).
      if (results.faceLandmarks) for (const landmarks of results.faceLandmarks) {
        [FaceLandmarker.FACE_LANDMARKS_TESSELATION, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE]
          .every((type, i) => drawingUtils.drawConnectors(landmarks, type, { color: "#C0C0C070", lineWidth: i == 0 ? 1 : 4 }))
      };

      // Checks
      let indice = 0;
      for (const accion of this.acciones) {
        if (
          results.faceLandmarks &&
          results.faceBlendshapes &&
          results.faceBlendshapes[0] &&
          results.faceBlendshapes[0].categories?.find((shape: Category) => shape?.categoryName === accion.atributo)?.score > 0.4
        ) {
          // Verificar si la acción ya se completó
          if (!this.accionesCompletadas[accion.nombre]) {
            // Marcar la acción como completada
            this.accionesCompletadas[accion.nombre] = true;
      
            // Mostrar título de la siguiente acción disponible
            const accionesDisponibles = this.acciones.filter(a => !this.accionesCompletadas[a.nombre]);
            if (accionesDisponibles.length > 0) {
              const siguienteAccion = accionesDisponibles[indice];
              const tituloElemento = document.getElementById('titulo-accion');
              indice++
              if (tituloElemento) {
                tituloElemento.innerText = siguienteAccion.nombre;
              }
            } else {
              // Todas las acciones han sido completadas
              this.todasAccionesCompletadas = true;
              document.getElementById('titulo-accion')!.innerText = "Muy bien has realizado todas las acciones correctamente";
            }
          }
      
          break; // Salir del bucle después de completar una acción
        }
      }
      
      // Call this function again to keep predicting when the browser is ready.
      this.tracking == true && window.requestAnimationFrame(predictWebcam);
    
    }
  }

  // Implementar la liberación de recursos y limpiar el canvas y video
  stopTracking() {
    this.tracking = false;
    if (this.video && this.video.srcObject) {
      (this.video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      this.video.srcObject = null;
    }
    if (this.canvasCtx) {
      this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    }
  }

  volverAlInicio() {
    this.tracking = false;
    this.todasAccionesCompletadas = false;
    this.router.navigate(['/home-damnificada']);
  }
}
