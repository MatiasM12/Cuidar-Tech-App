export class VistaUsuarioPersona {

    constructor(idUsuario=0, email="", rolDeUsuario="", idPersona=0){
        this.idUsuario = idUsuario;
        this.email = email;
        this.rolDeUsuario = rolDeUsuario;
        this.idPersona = idPersona;
    }

    idUsuario: number;
    email: string;
    rolDeUsuario: string;
    idPersona: number;
}
