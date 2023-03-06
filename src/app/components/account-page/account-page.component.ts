import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { Employee } from 'src/app/models/employee';
import { Person } from 'src/app/models/person';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { PersonService } from 'src/app/services/person.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.css']
})
export class AccountPageComponent implements OnInit {
  public idNumber: string = "";
  imageFile?:File;
  public employee: Employee = { };
  imageBaseUrl=environment.AttendaceManagementSystemAPIBaseUrl+'profilepictures/';
  constructor(private employeeService: EmployeeService, private personService: PersonService, private authService: AuthService, private userStoreService: UserStoreService, private toast: NgToastService) { }



  ngOnInit(): void {
    this.userStoreService.getIdNumberFromStore().subscribe(val=>{
      const idNumberFromToken = this.authService.getIdNumberFromToken();
      this.idNumber = val || idNumberFromToken
    })

    this.getEmployee()
  }

    public getEmployee(): void {
      this.employeeService.getEmployee(this.idNumber).subscribe({
        next:(data) =>{
          if(data.status){
            this.employee = data.value
          }else{
            this.employee = {
              firstName: "",
              middleName: "",
              lastName: "",
              emailAddress: "",
              employeeIdNumber: "",
              employeeRoleName: ""
            }
          }
        },
        error:(e)=>{
          console.log(e);
        }
      });
    }

    public onUpdateEmloyee(editForm: NgForm): void {
      const person: Person = {
        firstName: editForm.value.firstName,
        middleName: editForm.value.middleName,
        lastName: editForm.value.lastName,
        validIdNumber: editForm.value.employeeIdNumber
      }
      console.log(person)
      this.employeeService.updateEmployee(editForm.value).subscribe({
        next:(data) =>{
          if(data.status){
            this.onUpdatePerson(person);
          }
          console.log(data.message)
        },
        error:(e)=>{
          console.log(e);
        }
      });
    }

    public onUpdatePerson(person: Person): void{
      this.personService.updatePerson(person).subscribe({
        next:(data) =>{
          if(data.status){
            this.toast.success({detail: "SUCCESS", summary: "Update User Information Successful", duration: 3000})
          this.getEmployee();
          }
          else{
            this.toast.error({detail: "ERROR", summary: "Update User Information Unsuccessful", duration: 3000})
          }
        },
        error:(e)=>{
          console.log(e);
        }
      });
    }

    public onUpdatePassword(editPasswordForm: NgForm): void {
      const person: Person = {
        validIdNumber: editPasswordForm.value.employeeIdNumber,
        password: editPasswordForm.value.password,
      }
      this.employeeService.updatePassword(editPasswordForm.value).subscribe({
        next:(data) =>{
          if(data.status){
            this.onUpdateFaceApiPassword(person);
          }
          console.log(data.message)
        },
        error:(e)=>{
          console.log(e);
        }
      });
      editPasswordForm.reset();
    }

    public onUpdateFaceApiPassword(person: Person){
      this.personService.updatePassword(person).subscribe({
        next:(data) =>{
          if(data.status){
            this.toast.success({detail: "SUCCESS", summary:"Update Password Successful", duration: 3000})
          this.getEmployee();
          }
          else{
            this.toast.error({detail: "ERROR", summary: "Update Password Unsuccessful", duration: 3000})
          }
          console.log(data.message)
        },
        error:(e)=>{
          console.log(e);
        }
    });
  }

    onChange(event:any){
      this.imageFile=event.target.files[0];
     }

    public onUpdateProfilePicture(editProfileForm: NgForm): void {

      let formData = new FormData();
      formData.append("employeeIdNumber",editProfileForm.value.employeeIdNumber??"");
      formData.append("imageFile",this.imageFile??"");
      this.employeeService.updateProfilePicture(formData).subscribe({
        next:(data) =>{
          if(data.status){
            this.toast.success({detail: "SUCCESS", summary: "Update Profile Picture Successful", duration: 3000})
          this.getEmployee();
          }
          else{
            this.toast.error({detail: "ERROR", summary: "Update Profile Picture Unsuccessful", duration: 3000})
          }
        },
        error:(e)=>{
          console.log(e);
        }
      });
      editProfileForm.reset();
    }

    public onDeleteEmloyee(employee: Employee): void {
      this.employeeService.deleteEmployee(employee.id!).subscribe({
        next:(data) =>{
          if(data.status){
            this.onDeletePerson(employee.employeeIdNumber!);
          }
          console.log(data.message)
        },
        error:(e)=>{
          console.log(e);
        }
      });
    }

    public onDeletePerson(validIdNumber: string): void{
      this.personService.deletePerson(validIdNumber).subscribe({
        next:(data) =>{
          if(data.status){
            this.toast.success({detail: "SUCCESS", summary: "Delete User Successful", duration: 3000})
          this.getEmployee();
          }
          else{
            this.toast.error({detail: "ERROR", summary: "Delete User Unsuccessful", duration: 3000})
          }
        },
        error:(e)=>{
          console.log(e);
        }
      });
    }



}
