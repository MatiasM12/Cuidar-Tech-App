export class PruebaDeVida {

    constructor(idPruebaDeVida = 0, fecha = new Date(), descripcion = '', estado = '',idRestriccion = 0, idPersonaRestriccion = 0, accion = '',esMultiple = false,idPruebaDeVidaMultiple = 0){
        this.idPruebaDeVida=idPruebaDeVida;
        this.fecha = fecha;
        this.descripcion=descripcion;
        this.estado = estado;
        this.idRestriccion=idRestriccion;
        this.idPersonaRestriccion= idPersonaRestriccion;
        this.accion = accion;
        this.esMultiple = esMultiple;
        this.idPruebaDeVidaMultiple =idPruebaDeVidaMultiple;
    }

    idPruebaDeVida: number;
    fecha: Date;
    descripcion: string;
    estado: string;
    idRestriccion: number;
    idPersonaRestriccion: number;
    accion: string;
    esMultiple: boolean;
    idPruebaDeVidaMultiple: number;
}
