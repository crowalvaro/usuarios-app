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
  private recursosaux:Recurso[]=[];
  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    let cont = 0;
    this.usuarioService.recursoExcel().subscribe(response =>
      {
        this.recursosaux=response as Recurso[];

        //Sin terminar
        let procesando=this.recursos.filter(recurso => recurso.estado.includes("Procesando"));

        console.log(procesando)

        for (let ob of procesando) {
            let cambio=this.recursosaux.find(rec => rec.idRecurso.includes(ob.idRecurso))
            console.log(cambio)
            if(cambio?.estado.includes("Completado")){
              swal.fire("Proceso","Se ha completado el proceso","success");
            }
        }if(procesando==undefined){
          cont=0;
        }


        //swal.fire("Proceso","Se ha completado el proceso","success");

           this.recursos=response as Recurso[];
          // console.log(this.recursos);
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
        descarga.setAttribute("download",`excel${cod}.zip`)
        document.body.appendChild(descarga);
        descarga.click();
      }
     }
   );
 }


}
