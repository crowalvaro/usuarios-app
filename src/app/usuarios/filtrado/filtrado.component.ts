import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'usuarios-filtrado',
  templateUrl: './filtrado.component.html',
  styleUrls: ['./filtrado.component.css']
})
export class FiltradoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  filtrar(){
    //Debo añadir a las paginas los parametros filtrados para que se guarde el filtrado y llamar de alguna forma a la api de diferente maneara a la actual que
    //recupera todos los datos de la base de datos
  }
  borrarfiltro(){

  }

}
