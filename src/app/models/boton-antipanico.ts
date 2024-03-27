export class BotonAntipanico {

    constructor(idBotonAntipanico=0, latitud=0, longitud=0, fecha=new Date(),idDmanificada=0){
        this.idBotonAntipanico = idBotonAntipanico;
        this.latitud = latitud;
        this.longitud = longitud;
        this.fecha = fecha;
        this.idDamnificada = idDmanificada;
    }

    idBotonAntipanico: number;
    latitud;
    longitud;
    fecha: Date;
    idDamnificada: number;
}
