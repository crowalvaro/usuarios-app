import { Component, OnInit } from '@angular/core';
import { UsuarioService} from '../usuario.service'
import { Recurso } from './recurso'
import swal from 'sweetalert2';

@Component({
  selector: 'solicitar-recurso',
  templateUrl: './solicitar-recurso.component.html',
  styleUrls: ['./solicitar-recurso.component.css']
})
export class SolicitarRecursoComponent implements OnInit {

  public recursos:Recurso[]=[];

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {

    this.usuarioService.recursoExcel().subscribe(response =>
      {
         //if(response.estado != "vacio"){
           this.recursos=response as Recurso[];
           console.log(this.recursos);
         //}
    });

 }

 public descargar(cod:string){
   this.usuarioService.descargarExcelFinal(cod).subscribe(
     (response) => {
       if(response.error){
         swal.fire(response.mensaje,response.error,"error")
       }
       else{


        const binaryData=[]
        binaryData.push(response)
        const filePath = window.URL.createObjectURL(new Blob(binaryData, {type: response.type}))
        const descarga = document.createElement("a");
        descarga.href=filePath;
        descarga.setAttribute("download",`excel${cod}.xlsx`)
        document.body.appendChild(descarga);
        descarga.click();
      }
     }
   );
 }


}
