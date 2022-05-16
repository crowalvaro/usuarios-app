import { Component, OnInit} from '@angular/core';
import { Usuario } from './usuario';
import { UsuarioService } from './usuario.service';
import { Router, ActivatedRoute } from '@angular/router';
import  swal  from 'sweetalert2';



@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
  public foto:string="";
  public fotoMarcada: any ;
  public errores : String[] = [];
  public titulo: String = "Crear Usuario"
  public usuario: Usuario = new Usuario();
  public url:String = "http://localhost:8080/api/uploads/img/usuario.png";
  constructor(private usuarioService: UsuarioService,
              private router: Router,
              private activedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarUsuario();
    this.foto=this.usuario.foto;
  }

  public create():void{

      //Aqui deberia transformar la fecha del formato dd/mm/yyyy al formato valido para la base de datos que es yyy-mm-dd
      // this.usuario.fecha_nac= formatDate(this.usuario.fecha_nac,"dd-MM-yyyy","es");

      this.usuarioService.create(this.usuario).subscribe(
      json =>{
        //Cuanndo se crear el usuario correctamente subo la foto
        this.subirFoto();
        this.router.navigate(["/usuarios"])
        swal.fire('Nuevo Usuario',`${json.mensaje}: ${json.usuario.nombre}`,'success');
      },
      err => {
        this.errores = err.error.errores as string[];
      }
      )
  }

  public cargarUsuario():void{
    this.activedRoute.params.subscribe(params =>{
      let id = params['id'];
      if(id){
        this.usuarioService.getUsuario(id).subscribe( usuario => {
          this.usuario = usuario;
          this.url = "http://localhost:8080/api/uploads/img/"+this.usuario.foto
          if(this.usuario.foto===""){
            this.url=this.url+"usuario.png"
          }
        }
      )

      }

    })
  }
  public update(): void{
    this.usuarioService.update(this.usuario).subscribe( json =>  {
      //Cuando se modifica correctamente el usuario subo la foto
      this.subirFoto()
      swal.fire('Usuario modificado',`${json.mensaje}: ${json.usuario.nombre}`,'success');
    },
    err => {
      this.errores = err.error.errores as string[];
    }
  )
  }

  seleccionarFoto(evento: any){

    this.fotoMarcada = evento.target.files[0];
    //Al marcar subo la foto (Deberia guardar la foto temporal y cuando modifique guardarla)
    //AL crear debo subir la foto despues de que se asigne el resto de valores obteniendo la id del usuario creado
    if(this.fotoMarcada.type.indexOf('image')<0){
      this.fotoMarcada = null;
      swal.fire('Error al seleccionar: ','No has seleccionado una imagen', 'error');
    }else{
      //Creo objeto reader para previsualizar la imagen
      let reader = new FileReader;
      reader.readAsDataURL(evento.target.files[0]);
      reader.onload=(event:any) =>{
        this.url=event.target.result;
      }
    }
  }

//Cuando suba o no foto nueva es cuando redirecciona
  subirFoto(){
    if(!this.fotoMarcada){
      this.fotoMarcada=null;
      this.router.navigate(['/usuarios'])
    }else{
      //Para modificar
      this.usuarioService.subirFoto(this.fotoMarcada,this.usuario.idUsuario).subscribe(
        usuario => {
          this.usuario = usuario;
          this.router.navigate(['/usuarios'])
        }
      );
    }

  }



}
