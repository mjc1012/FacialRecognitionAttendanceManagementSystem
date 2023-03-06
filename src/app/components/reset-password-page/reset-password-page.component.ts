import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Person } from 'src/app/models/person';
import { ResetPassword } from 'src/app/models/resetpassword';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { PersonService } from 'src/app/services/person.service';
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
  constructor(private resetPasswordService: ResetPasswordService, private personService: PersonService, private activateRoute: ActivatedRoute, private router: Router, private toast: NgToastService) {
    this.activateRoute.queryParams.subscribe(val=>{
      this.emailToReset = val['email'];
      let uriToken = val['code'];
      this.emailToken = uriToken.replace(/ /g, '+');
      console.log(this.emailToReset)
      console.log(this.emailToken)
    })
  }

  public onResetPassword(resetPasswordForm: NgForm): void {

    const newPassword = resetPasswordForm.value.password;
    const resetPassword: ResetPassword = {
      email: this.emailToReset,
      emailToken: this.emailToken,
      newPassword: newPassword
    }

    console.log(resetPassword)

    this.resetPasswordService.resetPassword(resetPassword).subscribe({
      next:(data) =>{
        if(data.status){
          this.onUpdateFaceApiPassword(data.value.employeeIdNumber, newPassword);
        }
        console.log(data.message)
      },
      error:(e)=>{
        console.log(e);
      }
    });
  }

  public onUpdateFaceApiPassword(idNumber: string, password: string){
    const person: Person = {
      validIdNumber: idNumber,
      password: password,
    }
    this.personService.updatePassword(person).subscribe({
      next:(data) =>{
        this.toast.success({detail: "SUCCESS", summary:"Successfully reseted password", duration: 3000})
        this.router.navigate(['login'])
        console.log(data.message)
      },
      error:(e)=>{
        console.log(e);
      }
  });
}

}
