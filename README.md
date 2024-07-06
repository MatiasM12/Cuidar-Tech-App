# Cuidar Tech App 📲

Cuidar Tech es un proyecto dedicado a la prevención de la violencia de género mediante el monitoreo de restricciones perimetrales. Este proyecto se basa en la continuación del proyecto original desarrollado por la Universidad Nacional de General Sarmiento (UNGS), que puedes encontrar [aquí](https://www.ungs.edu.ar/new/cuidar-tech-una-posible-solucion-tecnologica-para-intervenir-en-casos-de-violencia-domestica-contra-las-mujeres). En esta nueva fase, hemos implementado dos funcionalidades clave: pruebas de vida automáticas y predicción de rutinas para prevenir violaciones de restricciones perimetrales. Ademas de que implementamos otras mejores tanto esteticas como funcionales. Este es el repositorio que contiene el frontend del proyecto, podes econtrar el backend [aquí](https://github.com/MatiasM12/Cuidar-Tech-Backend) y el respositorio del frontend [aqui](https://github.com/MatiasM12/Cuidar-Tech-Frontend).

## Instrucciones para correr el código 👨‍🏫

### Para correr en el navegador 💻

1. Primero, asegúrate de tener Node.js y npm instalados en tu sistema. Puedes descargarlos desde [nodejs.org](https://nodejs.org/).

2. Clona el repositorio de VDGApp desde GitHub:

   ```bash
   git clone <URL_del_repositorio>
   ```

3. Navega hasta el directorio del proyecto:

   ```bash
   cd VDGApp
   ```

4. Instala las dependencias del proyecto utilizando npm:

   ```bash
   npm install --force
   npm install -g @angular/cli 
   ```

5. Corrige cualquier problema de seguridad con:

   ```bash
   npm audit fix --force
   ```
   
6. Cambiar la URL del backend: Si el backend está desplegado en una ubicación diferente, asegúrate de cambiar la URL dentro del archivo `environments/environment.ts`. En nuestro caso tenemos la ip y puertos locales pero esto depende de tu pc o si tener el servidor deplegado en algun hosting.

      ![image](https://github.com/MatiasM12/VdgApp/assets/86579814/1a098cac-2b36-4c1d-bef3-3a1f503998b2)

8. Para iniciar el servidor de desarrollo, ejecuta el siguiente comando:

   ```bash
   ionic serve
   ```
   
  Esto abrira una pestaña nueva en tu navegador predeterminado. Hay que tener en cuenta que debemos tener versiones de java y gradle compatibles, junto a sus variables de entorno configuradas correctamente (JAVA_HOME y GRADLE_HOME)
   
### Para correr en un emulador android 📱

1. Instalar andorid studio:
  https://developer.android.com/studio?hl=es-419

2. Verificar quue tengamos instaldo correctamente el SDK Manager, para esto nos dirigimos dentro de android studio a `Menu > Tools > SDK Manager` aqui podemos instalar y ver los SDK que tenemos.

      ![image](https://github.com/MatiasM12/VdgApp/assets/86579814/de44e123-1622-4b14-9230-b1d83555af24)


3. Configuurar las variables de entorno ANDROID_HOME y ANDROID_SDK_ROOT, esto es diferente dependiendo el sistema operativo pero en windows deberia verse algo asi:

      ![image](https://github.com/MatiasM12/VdgApp/assets/86579814/ab2fdc9d-1b94-47bd-9240-b88225dee5e9)

4. Una vez que ya tenemos configurado correctamente andorid studio, debemos correr los siguientes comandos en a teminal del proyecto:

    -Instalamos algunas dependencias que pueden llegar a fallar
     ```bash
      npm install @capacitor/android --force
      npm install @capacitor/core @capacitor/cli --force
      npm install @capacitor-community/http --force
      npm i cordova-plugin-camera --force
     ```
    -Hacemos un build del proyecto
    ```bash
      ionic build 
     ```
    -Generamos la aplicacion android
    ```bash
      ionic build android
     ```
    -Configuramos y sincronizamos el proyecto con capacitor
    ```bash
      ionic integrations enable capacitor
      npx cap sync
      npx cap add android
     ```
    Luego de esos comandos se deberia agregar una carpeta llamada android a nuestro proyecto
   
     ![image](https://github.com/MatiasM12/VdgApp/assets/86579814/86789634-bd19-4653-abb2-ec3ea486b020)
      
    -Para asegurar el funcionamiento adecuado de nuestra aplicación Android, es crucial verificar y configurar correctamente los permisos en el archivo `AndroidManifest.xml`. Este archivo se encuentra en la ruta `android/app/src/main/AndroidManifest.xml` de nuestro proyecto.
      ```java
        <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
        <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
        <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
        <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
        <uses-permission android:name="android.permission.INTERNET" />
        <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
        <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
        <uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />
        <uses-permission android:name="android.permission.WAKE_LOCK" />
        <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
        <uses-permission android:name="android.Manifest.permission.REQUEST_IGNORE_BATTERY_OPTIMIZACIONES" />
        <uses-feature android:name="android.hardware.location.gps" />
        <uses-feature android:name="android.hardware.camera" />
        <uses-feature android:name="android.hardware.camera.autofocus" />
        <uses-feature android:name="android.hardware.camera2" />
     ```

6. Configuracion de la ip local: para que nuestra app se pueda comunicar con el backend debemos tener configurada correctamente la ip y puerto local en `environments/environment.ts`. para saber cual es la ip, en windows podemos correr el comando ipconfig y en linux tenemos ifconfig

     ![image](https://github.com/MatiasM12/VdgApp/assets/86579814/60525964-6828-49b3-a553-6912d77d02ac)

7. Conectar nuestro android con la depuracion USB activada, para activar la depuracion usb debemos:

    Activar las Opciones de Desarrollador:

      a. Ve a la aplicación "Configuración" en tu dispositivo Android.
      
      b. Desplázate hacia abajo y busca la sección "Acerca del teléfono" o "Acerca del dispositivo". Pulsa sobre esta opción.
      
      c. Busca el número de compilación o número de versión de software en esta sección y tócalo varias veces seguidas (generalmente entre 7 y 10 veces). Esto activará las "Opciones de Desarrollador".
  
    Habilitar la Depuración USB:
  
      a. Una vez que las "Opciones de Desarrollador" estén habilitadas, regresa al menú principal de "Configuración".
      
      b. Ahora verás una nueva opción llamada "Opciones de Desarrollador" o "Programador" en el menú principal de configuración. Ingresa a esta sección.
      
      c. Busca y activa la opción "Depuración USB". Puede aparecer como "Habilitar depuración de USB" o similar.

8. Finalmente debemos correr el siguente comando con el dispositivo conectado:

     ```bash
       ionic cap run android -l --external
     ```
     Despues de correrlos nos aparecera en nuestro dispositivo la opcion de permitir depuracion usb a la pc, debemos darle ne aceptar para que funcione.
   
   Elegimos nuestro dispositivo:
   
     ![image](https://github.com/MatiasM12/VdgApp/assets/86579814/e14c82dc-89e6-4381-ae0d-0d31a31d37e5)

   Elegimos la red (deberia ser la misma ip configurada anteriormente):

     ![image](https://github.com/MatiasM12/VdgApp/assets/86579814/e02d1060-50c6-496b-8ef3-f15931a1e034)

  Si todo salio correctamente deberia haberse compipilado y abrierto la aplicacion en nuestro dispositivo conectado

  ![image](https://github.com/MatiasM12/VdgApp/assets/86579814/685d4fc9-1c24-4d82-8cd3-ae859f37c7ab)

  Si realizamos cambios en el codigo no hace falta volver a correr el comando, este se vuelva a complilar cuando guardamos nuevos cambios.
   
## Acceso a la aplicación 👤

Después de iniciar el servidor, la aplicación se desplegará en tu navegador predeterminado o en tu dispositivo. A partir de ahí, puedes acceder a la funcionalidad de inicio de sesión.

Para iniciar sesión, necesitarás credenciales válidas. Algunos usuarios válidos son:

- **Usuario Damnificada**: 
  - Correo electrónico: visctima1@victima1.com
  - Contraseña: *Nota: Las contraseñas están hasheadas, se debe recuperar una nueva contraseña.*

- **Usuario Victimario**: 
  - Correo electrónico: agresor1@agresor1.com
  - Contraseña: *Nota: Las contraseñas están hasheadas, se debe recuperar una nueva contraseña.*

## Recuperación de Contraseña 🔒

Para restablecer una contraseña, sigue uno de estos métodos:

1. **A través de la interfaz de usuario*: 
   - Ingresa a la app.
   - Ingresa tu correo electrónico.
   - Haz clic en "Olvidé mi contraseña".
   - Confirma la solicitud
   - Recibirás una nueva contraseña en el correo electrónico asociado (`pp2proyectoviolenciagenero@gmail.com`). O si estás desarrollando y tienes acceso al backend, puedes recuperar una nueva contraseña por la consola del servidor.
  
     ![image-removebg-preview (1)](https://github.com/MatiasM12/VdgApp/assets/86579814/0602e1b6-8e2a-4e4e-9bbb-5126180ea576)

2. **A través de la interfaz de usuario web*: 
   - Visita la página web de VDGApp.
   - Haz clic en "Olvidé mi contraseña".
   - Ingresa tu correo electrónico.
   - Recibirás una nueva contraseña en el correo electrónico asociado (`pp2proyectoviolenciagenero@gmail.com`). O si estás desarrollando y tienes acceso al backend, puedes recuperar una nueva contraseña por la consola del servidor.
  
     ![image](https://github.com/Nicolas2k19/PP2Frontend/assets/86579814/91cd1045-7755-425b-82de-fea141545413)

## Roles de Usuario 👤

VDGApp tiene dos roles de usuario principales con interfaces diferentes como se muestra a continuacion:

- **Damnificada**: Este rol representa a las víctimas de la violencia de género.

  ![image-removebg-preview_(5)-fxLW3yXoy-transformed](https://github.com/MatiasM12/VdgApp/assets/86579814/67c379e2-e0ae-4eaa-99fb-774011d6f594)
  

- **Victimario**: Este rol representa a los agresores.

  ![image-removebg-preview_(6)-bKr94wGb7-transformed](https://github.com/MatiasM12/VdgApp/assets/86579814/5578613e-d9c2-4eb8-a754-d48864c5b77f)

## Manual de usuario 📕

Para obtener una guia detallada de como funciona el sistema porfavopr leea el manual de usuario que subimos a esta repositorio.



