import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SnackbarService} from "../../services/snackbar.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgetPasswordForm:FormGroup

  token: string = ""

  constructor(private authService: AuthService, private route: ActivatedRoute,
              private snackbarService: SnackbarService, private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
    this.forgetPasswordForm= new FormGroup({
      email: new FormControl('',[Validators.required, Validators.email]),
    })
  }

  onSubmit(){
    this.snackbarService.openSnackBarMessage("Se ha enviado un email a la direción de correo introducida" +
        " para reestablecer la contraseña")

    this.userService.getPassword(this.forgetPasswordForm.get('email')?.value)
  }

}
