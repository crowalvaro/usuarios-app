import { Injectable } from '@angular/core';
import { formatDate} from '@angular/common';
import { Usuario } from './usuario';
import {AuthService} from './auth.service'
import { Recurso } from './solicitar-recurso/recurso';
import { Observable,  throwError, interval, timer} from 'rxjs';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { concatMap,map,catchError,tap,switchMap } from 'rxjs/operators';
import { Router } from '@angular/router'

@Injectable()
export class UsuarioService {

  private urlEndPoint: string = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient, private router : Router, private authService:AuthService) {
  }

    getUsuarios(page: number) : Observable<any>{
        return this.http.get(this.urlEndPoint + "/page/" + page).pipe(
          tap( (response: any) => {
              //Para cuando venga por la parte reactive
              if(!response.content){
                response = {"content": response};
              }
            (response.content as Usuario[]).forEach(usuario =>{
                console.log(usuario.nombre);
            });
          }),
          map( (response :any) => {
            //Para cuando venga por la parte reactive
            if(!response.content){
              response = {"content": response};
            }

            (response.content as Usuario[]).map(usuario => {
                usuario.fecha_nac = formatDate(usuario.fecha_nac,"EEE dd/MM/yyyy","es");
                return usuario
            });
            return response
          }),
          catchError(e =>{
            if(e.error.mensaje){
              console.error(e.error.mensaje)
            }
            return throwError(()=>e)
          })
        );
    }
            //Para hacer más flexible el tipo de datos que llegan desde el servidor uso el tipo any aunque se puede crear un mapa y usarlo
            //  map( (response:any )=> response.usuario as Usuario),
    create(usuario: Usuario): Observable<any>{
      return this.http.post<any>(this.urlEndPoint, usuario).pipe(
        catchError(e =>{

           if(e.status==400 && e.error.mensaje){ //bad request es que no se ha validado bien
             console.log(e.error.mensaje)
             return throwError(()=>e);
           }
          return throwError(()=>e);
        })
      )
    }

    getUsuario(id : number) : Observable<any>{
        return this.http.get<Usuario>(`${this.urlEndPoint}/${id}`).pipe(
          catchError(e => {
            this.router.navigate(['/usuarios']);
            if(e.error.mensaje){
              console.error(e.error.mensaje)
            }
            return throwError(()=>e);
          })
        );

    }

    update(usuario: Usuario): Observable<any>{
      return this.http.put<Usuario>(`${this.urlEndPoint}/${usuario.idUsuario}`,usuario).pipe(
        catchError(e => {
          if(e.status==400){ //bad request es que no se ha validado bien
            return throwError(()=>e);
          }
          if(e.error.mensaje){
            console.error(e.error.mensaje)
          }
          return throwError(()=>e);
        })
      );


    }

    delete(id: Number): Observable<any>{
      return this.http.delete<Usuario>(`${this.urlEndPoint}/${id}`).pipe(
        catchError(e => {
          this.router.navigate(['/usuarios']);
          if(e.error.mensaje){
            console.error(e.error.mensaje)
          }
          return throwError(()=>e);
        })
      );

    }
    //Guardo el id como string porque no se puede guardar en el form data un number
    subirFoto(archivo: File,id :any){

      //Si llega el id es que esta modificando si no es que esta creando

        //Para mandar tanto el archivo como el id
        let formData = new FormData();
        formData.append("archivo",archivo);
        formData.append("id",id);

        const req = new HttpRequest('POST',`${this.urlEndPoint}/upload`,formData,{
        });

        return this.http.request(req).pipe(
            map( (response: any) => response.usuario as Usuario),

        );


    }
    descargarExcel(): Observable<any>{
        console.log(`${this.urlEndPoint}/descargar/excel`)
        return this.http.get(`${this.urlEndPoint}/descargar/excel?user=${this.authService.usuario.nick}`)
    }

    descargarExcelFinal(cod:string): Observable<any>{
        return this.http.get(`${this.urlEndPoint}/descargar/excel/${cod}`,{ responseType: 'blob'})
    }

    recursoExcel(): Observable<any>{
      //Con el switch map es como se consegia hacer multiples peticiones
      return timer(1, 3000).pipe(
       switchMap(() => this.http.get(`${this.urlEndPoint}/descargar/excel/resultado`).pipe(
           map( (response: any) => response as Recurso[])))
        // console.log(`${this.urlEndPoint}/descargar/excel/resultado`)
        // return this.http.get(`${this.urlEndPoint}/descargar/excel/resultado`).pipe(
        //     map( (response: any) => response as Recurso[])
      );

    }





}
