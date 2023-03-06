import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResetPassword } from '../models/resetpassword';
import { ResponseApi } from '../models/response-api';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  private baseUrl: string = environment.AttendaceManagementSystemAPIBaseUrl + 'api/Employee';
  private userPayload: any;
  constructor(private http:HttpClient, private router: Router) {
  }


  public sendResetPasswordLink(email:string): Observable<ResponseApi>{
    const url = `${this.baseUrl}/send-reset-email/${email}`;
    return this.http.post<ResponseApi>(url, {});
  }

  public resetPassword(request: ResetPassword): Observable<ResponseApi>{
    const url = `${this.baseUrl}/reset-password`;
    return this.http.put<ResponseApi>(url, request);
  }

}
