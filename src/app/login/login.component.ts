import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormGroup, FormControl, Validators, FormGroupDirective,
  NgForm} from '@angular/forms';
import {AuthService} from "../../services/auth.service";
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher{
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup

  stateMatcher = new MyErrorStateMatcher ()

  constructor(
      private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',Validators.required)
    })
  }

  onSubmit(): void{
    this.loginForm.get('email')?.status
    this.authService.login(this.loginForm.value)
  }

}
