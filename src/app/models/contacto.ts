//import { Ubicacion } from './ubicacion';

export class Contacto {

    constructor(idContacto=0 ,apellido="", nombre="", email="", telefono="", relacion="",
    idDamnificada=0){
        this.idContacto = idContacto;
        this.apellido = apellido;
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.relacion = relacion;
        this.idDamnificada = idDamnificada;
    }

    idContacto: number;
    apellido: string;
    nombre: string;
    email: string;
    telefono: string;
    relacion: string;
    idDamnificada: number;
}
