import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private router:Router) { 
    //clear local storage
    localStorage.setItem("token","")
    localStorage.setItem("login","false")
    localStorage.setItem("email","")
  }

  ngOnInit(): void {
  }
  onsignin(){
    this.router.navigate(["docs/signin"])
  }
  onsignup(){
    this.router.navigate(["docs/signup"])
  
  }
}
