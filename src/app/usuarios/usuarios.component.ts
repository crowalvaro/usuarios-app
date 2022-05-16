import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario'
import { UsuarioService} from './usuario.service'
import swal from 'sweetalert2'
import { ActivatedRoute,Router } from '@angular/router'
import {AuthService} from './auth.service'

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
    public usuarios: Usuario[] = [];
    paginador:any;

   constructor(private usuarioService: UsuarioService,
                private activatedRoute:ActivatedRoute,
                private router:Router,
                public authService: AuthService) {}

   ngOnInit() {

     this.activatedRoute.paramMap.subscribe( params =>{

      let page: number = 0;
       // !Para escapar los posibles nulos
      if(!params.get('page')==null){
        page = 0;
      }else{
        //Mejor solucion deshabilitar strict null checks en tsconfig.json
        page= +params?.get('page')
      }

        this.usuarioService.getUsuarios(page).subscribe(response =>
          {
            //Para cuando venga por la parte reactive
            if(!response.content){
              response = {"content": response};
            }
          this.usuarios = response.content as Usuario[]
          console.log(this.usuarios)
          this.paginador = response;
        });

     }
   );
   }

   public delete(usuario: Usuario): void{

     const swalWithBootstrapButtons = swal.mixin({
     customClass: {
     confirmButton: 'btn btn-success',
     cancelButton: 'btn btn-danger'
     },
     buttonsStyling: false
   })

   swalWithBootstrapButtons.fire({
     title: '¿Estas seguro de borrar este usuario?',
     text: "¡Este cambio no es reversible!",
     icon: 'warning',
     showCancelButton: true,
     confirmButtonText: 'Si, eliminalo!',
     cancelButtonText: 'No, volver',
     reverseButtons: false
   }).then((result) => {
     if (result.isConfirmed) {
       this.usuarioService.delete(usuario.idUsuario).subscribe(
         json => {
           //Para recargar los usuarios
           this.usuarios = this.usuarios.filter(usu => usu !== usuario)

           swalWithBootstrapButtons.fire(
             `Usuario eliminado`,
             `${json.mensaje}`,
             'success'
           )
         }
       )

     } else if (
       result.dismiss === swal.DismissReason.cancel
     ) {

       swalWithBootstrapButtons.fire(
         'Abortado',
         `No se ha eliminado el usuario ${usuario.nick}!`,
         'error'
       )
     }
   })

   }

   public descargarExcel(){
     this.usuarioService.descargarExcel().subscribe(
       (response) => {
         console.log(response)

         swal.fire(
           'Estado solicitud: '+response.solicitud,
           `Se ha realizado la solicitud`,
           'info'
         )
         this.router.navigate(["/usuarios"]);
          // const binaryData=[]
          // binaryData.push(response)
          // const filePath = window.URL.createObjectURL(new Blob(binaryData, {type: response.type}))
          // const descarga = document.createElement("a");
          // descarga.href=filePath;
          // descarga.setAttribute("download","hola.xlsx")
          // document.body.appendChild(descarga);
          // descarga.click();
       }
     );
   }


 }
