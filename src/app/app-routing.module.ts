import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './Signup/signup.component';
import { MainComponent } from './main/main.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { TexteditorComponent } from './texteditor/texteditor.component';
import { Texteditor2Component } from './texteditor2/texteditor2.component';


const routes: Routes = [
{path: "", component:AboutComponent},
{ path:"docs/signin" , component:LoginComponent},
{path:"docs/signup",component:SignupComponent},
{path:"docs/home",component:MainComponent},
{path:"not-found",component:NotFoundComponent},
{path:"docs",component:Texteditor2Component},
{path:"**",redirectTo:"not-found"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
