import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SnackbarService} from "../../services/snackbar.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.scss']
})
export class ActivateAccountComponent implements OnInit {

  activationForm:FormGroup

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

    this.activationForm= new FormGroup({
      password: new FormControl('',[Validators.required, Validators.email]),
      repeat_password: new FormControl('',Validators.required)
    })
  }

  onSubmit(){
    console.log(this.activationForm.get('password'))
    console.log(this.activationForm.get('repeat_password'))
    if(this.activationForm.get('password')?.value === this.activationForm.get('repeat_password')?.value){
      let userData = JSON.parse(localStorage.getItem('userData')!)
      let email = userData['email']
      this.userService.setPassword(this.token,email,this.activationForm.get('password')?.value)
      this.router.navigateByUrl('/login')
    }else{
      this.snackbarService.openSnackBarMessage("Las contraseñas no coinciden")
    }
  }

}
