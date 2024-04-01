
export class Comisaria {

    constructor(idComisaria=0 ,nombre="", ciudad="", direccion="", telefono="", partido="",
    comisariaACargo="",coordenadaX="",coordenadaY=""){
        this.idComisaria = idComisaria;
        this.nombre = nombre;
        this.ciudad = ciudad;
        this.direccion = direccion;
        this.telefono = telefono;
        this.partido = partido;
        this.comisariaACargo = comisariaACargo;
        this.coordenadaX = coordenadaX;
        this.coordenadaY = coordenadaY;
    }

    idComisaria: number;
    nombre: string;
    ciudad: string;
    direccion: string;
    telefono: string;
    partido: string;
    comisariaACargo: string;
    coordenadaX: string;
    coordenadaY: string;
}