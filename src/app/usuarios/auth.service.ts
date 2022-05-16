import { Injectable } from '@angular/core';
import{Observable} from 'rxjs'
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Usuario} from './usuario'
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _token:any=null;
  private _usuario:any=null;
  constructor(private http: HttpClient) { }

//get
public get usuario():Usuario{
    if(this._usuario !=null){
      return this._usuario;
    }else if(this._usuario == null && sessionStorage.getItem('usuario')!=null){

      let datos_usuario= sessionStorage.getItem('usuario');
      if(datos_usuario!=null){
        this._usuario=JSON.parse(datos_usuario) as Usuario;
      }

      return this._usuario;
    }
    return new Usuario()
}
public get token():string{
  if(this._token !=null){
    return this._token;
  }else if(this._token == null && sessionStorage.getItem('token')!=null){
    let token= sessionStorage.getItem('token');
    if(token!=null){
      this._token=token;
    }
    return this._token;
  }
  return this._token;

}
login(usuario:Usuario):Observable<any>{
  const urlEndPoint = 'http://localhost:8080/oauth/token';
  const credenciales = btoa('angularapp'+':'+'contrasena');
  const httpHeaders = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded',
  'Authorization': 'Basic ' + credenciales
})
  let params = new URLSearchParams();
  params.set('grant_type','password')
  params.set('username',usuario.nick)
  params.set('password',usuario.contrasenia)
  //Uso decode por si el usuario o la contraseña tienen caracteres especiales ya que urlseach ya lo transforma
  //directamente
  return this.http.post<any>(urlEndPoint,params.toString(), {headers: httpHeaders});
}

guardarUsuario(accessToken: string):void{
  let datos = this.obtenerPayload(accessToken);
  this._usuario= new Usuario();
  this._usuario.nick = datos.user_name;
  this._usuario.roles = datos.authorities;

  //Guardo el usuario en el session storage
  sessionStorage.setItem('usuario',JSON.stringify(this._usuario));

}

guardarToken(accessToken: string):void{
  this._token = accessToken;
  sessionStorage.setItem('token',this._token);
}

obtenerPayload(accessToken:string):any{
  if(accessToken != null && accessToken!=''){
    return JSON.parse(atob(accessToken.split(".")[1]));
  }
  return null;
}

esAutenticado():boolean{
  let payload = this.obtenerPayload(this.token);
  if(payload!=null && payload.user_name && payload.user_name.length>0){
    return true;
  }
  return false;
}

tieneRole(role:string): boolean{
  if(this.usuario.roles.includes(role)){
    return true
  }
  return false;
}

logout():void{
  this._token = null;
  this._usuario=null;
  sessionStorage.removeItem("usuario");
  sessionStorage.removeItem("token");
}


}
