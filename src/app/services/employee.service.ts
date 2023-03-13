import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DeleteRange } from '../models/deleteRange';
import { Employee } from '../models/employee';
import { ResponseApi } from '../models/response-api';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl: string = environment.AttendaceManagementSystemAPIBaseUrl + 'api/Employee';

  constructor(private http:HttpClient) { }

  public getEmployees(): Observable<ResponseApi>{
    return this.http.get<ResponseApi>(this.baseUrl);
  }

  public getEmployee(employeeIdNumber: string): Observable<ResponseApi>{
    const url = `${this.baseUrl}/${employeeIdNumber}`;
    return this.http.get<ResponseApi>(url);
  }

  public addEmployee(request: Employee): Observable<ResponseApi>{
    return this.http.post<ResponseApi>(this.baseUrl, request);
  }

  public updateEmployee(request: Employee): Observable<ResponseApi>{
    return this.http.put<ResponseApi>(this.baseUrl, request);
  }

  public deleteEmployee(id: number): Observable<ResponseApi>{
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<ResponseApi>(url);
  }

  public deleteEmployees(request: DeleteRange): Observable<ResponseApi>{
    const url = `${this.baseUrl}`;
    return this.http.put<ResponseApi>(url, request);
  }

  public updatePassword(request: Employee): Observable<ResponseApi>{
    const url = `${this.baseUrl}/password`;
    return this.http.put<ResponseApi>(url, request);
  }

  public updateProfilePicture(formData: FormData): Observable<ResponseApi>{
    const url = `${this.baseUrl}/profile-pic`;
    return this.http.put<ResponseApi>(url, formData);
  }

  public recordAbsences(date: string): Observable<ResponseApi>{
    let today = new Date();
    const url = `${this.baseUrl}/date/${date}`;
    return this.http.get<ResponseApi>(url);
  }

}
