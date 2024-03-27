# VDGApp 📲

## Instrucciones para correr el código

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
   
6. Cambiar la URL del backend: Si el backend está desplegado en una ubicación diferente, asegúrate de cambiar la URL dentro del archivo `environments/environment.ts`.
  
7. Para iniciar el servidor de desarrollo, ejecuta el siguiente comando:

   ```bash
   ionic serve
   ```

## Acceso a la aplicación

Después de iniciar el servidor, la aplicación se desplegará en tu navegador predeterminado. A partir de ahí, puedes acceder a la funcionalidad de inicio de sesión.

Para iniciar sesión, necesitarás credenciales válidas. Algunos usuarios válidos son:

- **Usuario Victima**: 
  - Correo electrónico: visctima1@victima1.com
  - Contraseña: *Nota: Las contraseñas están hasheadas, se debe recuperar una nueva contraseña.*

- **Usuario Agresor**: 
  - Correo electrónico: agresor1@agresor1.com
  - Contraseña: *Nota: Las contraseñas están hasheadas, se debe recuperar una nueva contraseña.*

## Recuperación de Contraseña

Para restablecer una contraseña, sigue uno de estos métodos:

1. **A través de la interfaz de usuario*: 
   - Visita la página web de VDGApp.
   - Haz clic en "Olvidé mi contraseña".
   - Ingresa tu correo electrónico.
   - Recibirás una nueva contraseña en el correo electrónico asociado (`pp2proyectoviolenciagenero@gmail.com`).

2. **A través de la consola del backend**:
   - Visita la página web de VDGApp.
   - Haz clic en "Olvidé mi contraseña".
   - Si estás desarrollando y tienes acceso al backend, puedes recuperar una nueva contraseña por la consola del servidor.

## Roles de Usuario

VDGApp tiene dos roles de usuario principales con interfaces diferentes como se muestra a continuacion:

- **Victima**: Este rol representa a las víctimas de la violencia de género.
  
  ![image](https://github.com/MatiasM12/VdgApp/assets/86579814/d20a9b34-9aa7-48e1-a224-4be28653d826)![image](https://github.com/MatiasM12/VdgApp/assets/86579814/7b5b5c3f-9d65-4f8c-82f9-f1d3b1a69ae3)


- **Agresor**: Este rol representa a los agresores.
  
  ![image](https://github.com/MatiasM12/VdgApp/assets/86579814/c9c10df7-6652-4bf8-b6d4-696d2ad0e17c)![image](https://github.com/MatiasM12/VdgApp/assets/86579814/31948517-6ac2-4b90-ab63-f91dbeb53f1d)




