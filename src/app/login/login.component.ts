import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../sharedServices/auth.service';
import { environment } from 'src/environments/environment';
import { FormBuilder,Validators,FormGroup ,AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  password!:string;
  email!:string;
  loginForm!: FormGroup;
  errormessage:string='';

  constructor(private router:Router,private auth:AuthService,private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.customEmailValidator]],
      password: ['', Validators.required]
    });
  }
  signinhandle(){
    if (this.loginForm.invalid) {
      return;
    }
    else{
      const { email, password } = this.loginForm.value;
      this.auth.signin({email:email,password:password}).subscribe((data)=>{
        if(data){
          localStorage.setItem("login","true")
          localStorage.setItem("token",data.token)
          localStorage.setItem("email",email)
          this.router.navigate(["docs/home"])
        }
      },
      (error)=>{
        this.errormessage=error.error.message;
      })
    
    }
  }
  customEmailValidator(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { invalidEmail: true };
  }
  returnsignup(){
    this.router.navigate(["docs/signup"])
    localStorage.setItem("token","")
    localStorage.setItem("login","false")
    localStorage.setItem("email","")
  }

}
