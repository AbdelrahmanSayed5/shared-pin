import { Component, OnInit } from '@angular/core';
import { AuthService } from '../sharedServices/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  username!:string;
  email!:string;
  password!:string;
  registerForm!: FormGroup;
  errormessage: string = '';
  constructor(private auth:AuthService,private route:Router,private fb: FormBuilder) { 
    localStorage.setItem("token","")
    localStorage.setItem("login","false")
    localStorage.setItem("email","")
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.customEmailValidator]],
      password: ['', Validators.required]
    });
  }
  customEmailValidator(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { invalidEmail: true };
  }
  signuphandle(){
    if (this.registerForm.invalid) {
      return;
    }
    else{
      const { username, email,password } = this.registerForm.value;
      this.auth.signup({username,email,password}).subscribe((data)=>{
        if(data){
          this.route.navigate(["docs/signin"])
          console.log(data)
        }
      })

    }
  
  }
  returnToLogin(){
    this.route.navigate(["docs/signin"])

  }
}
