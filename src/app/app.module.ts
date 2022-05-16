import { NgModule,Pipe, PipeTransform } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { FormularioComponent } from './usuarios/formulario.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule,Routes } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { UsuarioService } from './usuarios/usuario.service';
import { VerUsuarioComponent } from './usuarios/ver-usuario.component';
import { PaginatorComponent } from './paginator/paginator.component';
import {registerLocaleData} from '@angular/common';
import  localeES  from '@angular/common/locales/es';
import {DomSanitizer,SafeResourceUrl} from '@angular/platform-browser';
import { FiltradoComponent } from './usuarios/filtrado/filtrado.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {AuthGuard}from './usuarios/guards/auth.guard';
import {RoleGuard}from './usuarios/guards/role.guard';
import {TokenInterceptor} from './usuarios/interceptores/token.interceptor'
import {AuthInterceptor} from './usuarios/interceptores/auth.interceptor';
import { SolicitarRecursoComponent } from './usuarios/solicitar-recurso/solicitar-recurso.component'

@Pipe({ name: 'safeResourceUrl' })
export class SafeUrlPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  public transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}



registerLocaleData(localeES,"es");
const routes: Routes = [
  //Para redireccionar a una ruta principal
  {path: '',redirectTo: '/usuarios', pathMatch: 'full'},
  {path: 'usuarios',component: UsuariosComponent},
  {path: 'usuarios/page/:page',component: UsuariosComponent},
  {path: 'usuarios/form',component: FormularioComponent},
  {path: 'usuarios/form/:id',component: FormularioComponent, canActivate:[AuthGuard,RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'usuarios/ver/:id',component: VerUsuarioComponent, canActivate:[AuthGuard,RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'login',component: LoginComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    UsuariosComponent,
    FormularioComponent,
    VerUsuarioComponent,
    PaginatorComponent,
    FiltradoComponent,
    LoginComponent,
    HeaderComponent,
    SolicitarRecursoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    NgbModule
  ],
  providers: [UsuarioService,
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
