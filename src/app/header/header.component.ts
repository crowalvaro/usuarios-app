import { Component, OnInit } from '@angular/core';
import {AuthService} from '../usuarios/auth.service'
import {Router} from '@angular/router'
import swal from 'sweetalert2'
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public authService:AuthService,private router:Router) { }

  logout(){
    this.authService.logout();
    swal.fire("Cerrar sesión","Has cerrado sesion con exito","success");
    this.router.navigate(['/login'])
  }

  ngOnInit(): void {
  }

}
