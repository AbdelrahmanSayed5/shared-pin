import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import  {NavBarComponent} from '../SharedComponents/nav-bar/nav-bar.component';
import { SignupComponent } from './Signup/signup.component';
import { LoginComponent } from './login/login.component';
import { FileComponent } from '../SharedComponents/file/file.component';
import { MainComponent } from './main/main.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AboutComponent } from './about/about.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { TexteditorComponent } from './texteditor/texteditor.component';
import { Texteditor2Component } from './texteditor2/texteditor2.component';
@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    SignupComponent,
    LoginComponent,
    FileComponent,
    MainComponent,
    AboutComponent,
    NotFoundComponent,
    TexteditorComponent,
    Texteditor2Component,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,FormsModule,
    HttpClientModule,ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
