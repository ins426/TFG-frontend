import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SnackbarService} from "../../services/snackbar.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {

  recoverForm:FormGroup

  token: string = ""

  constructor(private authService: AuthService, private route: ActivatedRoute,
              private snackbarService: SnackbarService, private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.token = params['token']
      })

    this.authService.checkToken(this.token)

    this.recoverForm= new FormGroup({
      password: new FormControl('',[Validators.required, Validators.email]),
      repeat_password: new FormControl('',Validators.required)
    })
  }

  onSubmit(){
    if(this.recoverForm.get('password')?.value === this.recoverForm.get('repeat_password')?.value){
      let userData = JSON.parse(localStorage.getItem('userData')!)
      let email = userData['email']
      this.userService.setPassword(this.token,email,this.recoverForm.get('password')?.value)
      this.router.navigateByUrl('/login')
    }else{
      this.snackbarService.openSnackBarMessage("Las contraseñas no coinciden")
    }
  }

}
