import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import { UsuarioService } from './usuario.service';
import { ActivatedRoute} from '@angular/router';
import  swal  from 'sweetalert2';
@Component({
  selector: 'app-ver-usuario',
  templateUrl: './ver-usuario.component.html',
  styleUrls: ['./ver-usuario.component.css']
})
export class VerUsuarioComponent implements OnInit {
titulo: String = "Ver Usuario";
usuario: Usuario = new Usuario();
private fotoMarcada: any
  constructor(private usuarioService: UsuarioService,
              private activedRoute: ActivatedRoute,
            ) {

  }

  ngOnInit(): void {
    this.cargarUsuario()
  }

  public cargarUsuario():void{
    this.activedRoute.params.subscribe(params =>{
      let id: number = params['id'];
      if(id){
        this.usuarioService.getUsuario(id).subscribe( (usuario) => this.usuario = usuario)
      }
    })
  }

  seleccionarFoto(evento: any){
    this.fotoMarcada = evento.target.files[0];
    if(this.fotoMarcada.type.indexOf('image')<0){
      swal.fire('Error al seleccionar: ','No has seleccionado una imagen', 'error');
    }
  }

  subirFoto(){
    if(!this.fotoMarcada){
      swal.fire('Error al subir: ','No has seleccionado una foto', 'error');
    }else{
      this.usuarioService.subirFoto(this.fotoMarcada,this.usuario.idUsuario).subscribe(
        usuario => {
          this.usuario = usuario;
        }
    );

    }

  }



}
