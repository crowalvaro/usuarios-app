import { Component, OnInit } from '@angular/core';
import {Usuario} from "../usuarios/usuario"
import  swal  from 'sweetalert2';
import {AuthService} from '../usuarios/auth.service'
import {Router} from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo:string = "Inica sesión";
  usuario:Usuario;

  constructor(private authService: AuthService, private router: Router) {
    this.usuario=new Usuario();
  }

  ngOnInit(): void {
    if(this.authService.esAutenticado()){
      swal.fire('Login', `Hola ${this.authService.usuario.nick} ya estás autenticado`,'info')
      this.router.navigate(['/usuarios']);
    }
  }

  login():void {
    if(this.usuario.nick=='' ||this.usuario.contrasenia==''){
      swal.fire('Error login','El nick o la contraseña no pueden estar vacios', 'error');
      return;
    }
    this.authService.login(this.usuario).subscribe(response =>{
      let datos = JSON.parse(atob(response.access_token.split(".")[1]))

      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      let usuario = this.authService.usuario;


      this.router.navigate(['/usuarios']);
      swal.fire('Login', `Hola ${usuario.nick}, has iniciado sesión`,'success');
    },
      err => {
        if(err.status == 400){
          //No es bueno decir si solo el pass o el ussuario esta correcto
          //Para dificultar los ataques
          swal.fire('Error login','Usuario o clave incorrecta', 'error');
        }
    }
    )
  }
}
