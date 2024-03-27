export class PruebaDeVida {

    constructor(idPruebaDeVida = 0, fecha = new Date(), descripcion = '', estadoPruebaDeVida = '',idRestriccion = 0, idPersonaRestriccion = 0){
        this.idPruebaDeVida=idPruebaDeVida;
        this.fecha = fecha;
        this.descripcion=descripcion;
        this.estadoPruebaDeVida = estadoPruebaDeVida;
        this.idRestriccion=idRestriccion;
        this. idPersonaRestriccion= idPersonaRestriccion;
    }

    idPruebaDeVida: number;
    fecha: Date;
    descripcion: string;
    estadoPruebaDeVida: string;
    idRestriccion: number;
    idPersonaRestriccion: number;

}
