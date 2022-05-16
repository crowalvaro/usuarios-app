export class Usuario {
  idUsuario: any =0; //lo pongo en any para que tambien lo reconozca la reactiva
  nick: string = "";
  email: string = "";
  nombre: string = "prueba";
  apellidos: string ="";
  fecha_nac: string ="";
  contrasenia: string="";
  foto: string ="";
  roles: string[]=[];
}
