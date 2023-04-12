import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Person } from 'src/app/models/person';
import { ResetPassword } from 'src/app/models/resetpassword';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.component.html',
  styleUrls: ['./reset-password-page.component.css']
})
export class ResetPasswordPageComponent {
  emailToReset!: string;
  emailToken!: string;
  newPassword = ""
  samePassword = false
  constructor(private resetPasswordService: ResetPasswordService, private activateRoute: ActivatedRoute, private router: Router, private toast: NgToastService) {
    this.activateRoute.queryParams.subscribe(val=>{
      this.emailToReset = val['email'];
      let uriToken = val['code'];
      this.emailToken = uriToken.replace(/ /g, '+');
    })
  }

  set password(value: string){
    this.newPassword = value
  }

  checkPassword(value: string){
      this.samePassword = value === this.newPassword
  }

  public onResetPassword(resetPasswordForm: NgForm): void {

    const newPassword = resetPasswordForm.value.password;
    const resetPassword: ResetPassword = {
      email: this.emailToReset,
      emailToken: this.emailToken,
      newPassword: newPassword
    }

    this.resetPasswordService.resetPassword(resetPassword).subscribe({
      next:(data) =>{
        if(data.status){
          this.toast.success({detail: "SUCCESS", summary:"Reset Password Successful", duration: 2000})
        this.router.navigate(['login'])
        }
        else{
          this.toast.error({detail: "ERROR", summary: data.message, duration: 2000})
        }
      },
      error:(e)=>{
        this.toast.error({detail: "ERROR", summary: e, duration: 2000})
      }
    });
  }

}
