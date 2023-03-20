import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employee } from '../models/employee';
import { ResponseApi } from '../models/response-api';
import { TokenApi } from '../models/token-Api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = environment.AttendaceManagementSystemAPIBaseUrl + 'api/Employee';
  private userPayload: any;
  constructor(private http:HttpClient, private router: Router) {
    this.userPayload = this.decodedToken();
  }

  public login(request: Employee): Observable<ResponseApi>{
    const url = `${this.baseUrl}/authenticate`;
    return this.http.post<ResponseApi>(url, request);
  }

  public authenticateForAttendance(request: Employee): Observable<ResponseApi>{
    const url = `${this.baseUrl}/authenticate-for-attendance`;
    return this.http.post<ResponseApi>(url, request);
  }

  storeAccessToken(tokenValue: string){
    localStorage.setItem('accessToken', tokenValue);
  }

  getAccessToken(){
    return localStorage.getItem('accessToken');
  }


  storeRefreshToken(tokenValue: string){
    localStorage.setItem('refreshToken', tokenValue);
  }

  getRefreshToken(){
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn(): boolean{
    return !!localStorage.getItem('accessToken');
  }

  logout(){
    localStorage.clear();
  }

  decodedToken(){
    const jwtHelper = new JwtHelperService();
    const accessToken = this.getAccessToken()!;
    return jwtHelper.decodeToken(accessToken);
  }

  getPairIdFromToken(){
    if(this.userPayload){
      return this.userPayload.name;
    }
  }

  getRoleFromToken(){
    if(this.userPayload){
      return this.userPayload.role;
    }
  }

  renewToken(request: TokenApi){
    const url = `${this.baseUrl}/refresh-token`;
    return this.http.post<ResponseApi>(url, request);
  }
}
