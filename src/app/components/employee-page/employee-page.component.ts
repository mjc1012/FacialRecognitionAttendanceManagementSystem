import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from 'src/app/models/employee';
import { Person } from 'src/app/models/person';
import { EmployeeService } from 'src/app/services/employee.service';
import { PersonService } from 'src/app/services/person.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-employee-page',
  templateUrl: './employee-page.component.html',
  styleUrls: ['./employee-page.component.css']
})
export class EmployeePageComponent implements OnInit {
  public employees: Employee[] = [];
  public editEmployee: Employee = {}
  imageFile?:File;

  public deleteEmployee: Employee = {}
  imageBaseUrl=environment.AttendaceManagementSystemAPIBaseUrl+'profilepictures/';

  constructor(private employeeService: EmployeeService, private personService: PersonService) { }

  ngOnInit(): void {
    this.getEmployees()
  }

    public getEmployees(): void {
      this.employeeService.getEmployees().subscribe({
        next:(data) =>{
          if(data.status){
            this.employees = data.value
            console.log(data.message)
          }else{
            this.employees = []
          }
        },
        error:(e)=>{
          console.log(e);
        }
      });
    }

    public onAddEmloyee(addForm: NgForm): void {
      const person: Person = {
        firstName: addForm.value.firstName,
        middleName: addForm.value.middleName,
        lastName: addForm.value.lastName,
        validIdNumber: addForm.value.employeeIdNumber
      }
      this.employeeService.addEmployee(addForm.value).subscribe({
        next:(data) =>{
          if(data.status){
            this.getEmployees();
            this.onAddPerson(person);
            addForm.reset();
          }
          console.log(data.message)
        },
        error:(e)=>{
          console.log(e);
          addForm.reset();
        }
      });
    }

    public onAddPerson(person: Person): void{
      this.personService.addPerson(person).subscribe({
        next:(data) =>{
          console.log(data.message)
        },
        error:(e)=>{
          console.log(e);
        }
      });
    }

    getEmployeeToUpdate(employee: Employee){
      this.editEmployee = employee
    }

    public onUpdateEmloyee(editForm: NgForm): void {
      const person: Person = {
        firstName: editForm.value.firstName,
        middleName: editForm.value.middleName,
        lastName: editForm.value.lastName,
        validIdNumber: editForm.value.employeeIdNumber
      }
      this.employeeService.updateEmployee(editForm.value).subscribe({
        next:(data) =>{
          if(data.status){
            this.getEmployees();
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
          console.log(data.message)
        },
        error:(e)=>{
          console.log(e);
        }
      });
    }

    getEmployeeToDelete(employee: Employee){
      this.deleteEmployee = employee
    }

    public onDeleteEmloyee(employee: Employee): void {
      this.employeeService.deleteEmployee(employee.id!).subscribe({
        next:(data) =>{
          if(data.status){
            this.getEmployees();
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
          console.log(data.message)
        },
        error:(e)=>{
          console.log(e);
        }
      });
    }


}
