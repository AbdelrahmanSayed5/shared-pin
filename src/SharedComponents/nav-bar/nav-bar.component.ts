import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  login!:string;
  email!:string;
  constructor(private route:Router) { 
    this.login=localStorage.getItem("login")||"false";
    console.log("loging"+this.login)
    this.email=localStorage.getItem("email")||"";


    
  }

  ngOnInit(): void {
    console.log("login status"+this.login)
    console.log(this.email)
  }
  gotosignin(){
    this.route.navigate(["docs/signin"])
  }

}
