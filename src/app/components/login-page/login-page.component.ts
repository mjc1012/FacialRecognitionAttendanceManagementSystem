import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Person } from 'src/app/models/person';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { PersonService } from 'src/app/services/person.service';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  resetPasswordEmail!: string;
  isValidEmail = false;

  constructor(private authService: AuthService, private router: Router, private toast: NgToastService, private userStoreService: UserStoreService, private personService: PersonService,
    private resetPasswordService: ResetPasswordService) { }

  ngOnInit(): void {
  }

  onLogin(loginForm: NgForm){
    const password = loginForm.value.password
    this.authService.login(loginForm.value).subscribe({
      next:(data) =>{
        if(data.status){
          this.authService.storeAccessToken(data.value.accessToken);
          this.authService.storeRefreshToken(data.value.refreshToken);
          const tokenPayload = this.authService.decodedToken();
          this.userStoreService.setPairIdForStore(tokenPayload.name);
          this.userStoreService.setRoleForStore(tokenPayload.role);
          const person: Person = {
            pairId: tokenPayload.name,
            password: password
          }
          this.AuthenticatePerson(person);
          this.onNavigate(tokenPayload.role);
        }
        else{
          this.toast.error({detail: "ERROR", summary: data.message, duration: 2000})
        }
      },
      error:(e)=>{
        console.log(e);
      }
    });
    loginForm.reset();
  }

  AuthenticatePerson(person: Person){
    this.personService.authenticate(person).subscribe({
      next:(data) =>{
        if(data.status){
        this.toast.success({detail: "SUCCESS", summary: data.message, duration: 2000})
        }
        else{
          this.toast.error({detail: "ERROR", summary: data.message, duration: 2000})
        }
        this.personService.storeAccessToken(data.value.accessToken);
          this.personService.storeRefreshToken(data.value.refreshToken);
        console.log(data.message)
      },
      error:(e)=>{
        console.log(e);
      }
    });
  }

  onNavigate(role: string){
    if(role === 'Admin'){
      this.router.navigate(['employee-list'])
    }
    else if(role === 'User'){
      this.router.navigate(['account'])
    }
  }

  checkValidEmail(event: string): boolean{
    const value = event;
    const pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,3})+$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }

  onForgotPassword(){
    this.resetPasswordService.sendResetPasswordLink(this.resetPasswordEmail).subscribe({
      next:(data) =>{
        this.resetPasswordEmail = ""
        if(data.status)this.toast.success({detail: "SUCCESS", summary: data.message, duration: 2000})
        else this.toast.error({detail: "ERROR", summary: data.message, duration: 2000})
      },
      error:(e)=>{
        this.toast.error({detail: "ERROR", summary: e, duration: 2000})
      }
    });
  }

}
