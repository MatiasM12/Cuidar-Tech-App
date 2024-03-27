import { Ubicacion } from './ubicacion';

export class UbicacionDTO {

    constructor(ubicacionDamnificada = new Ubicacion, ubicacionVictimario = new Ubicacion) {
        this.ubicacionDamnificada = ubicacionDamnificada;
        this.ubicacionVictimario = ubicacionVictimario;
    }

    ubicacionDamnificada: Ubicacion;
    ubicacionVictimario: Ubicacion;

}
