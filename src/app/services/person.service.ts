import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Person } from '../models/person';
import { ResponseApi } from '../models/response-api';
import { TokenApi } from '../models/token-Api';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private baseUrl: string = environment.FaceRecongtionAPIBaseUrl + 'api/Person';

  constructor(private http:HttpClient) { }

  public getPeople(): Observable<ResponseApi>{
    return this.http.get<ResponseApi>(this.baseUrl);
  }

  public getPerson(validIdNumber: string): Observable<ResponseApi>{
    const url = `${this.baseUrl}/${validIdNumber}`;
    return this.http.get<ResponseApi>(url);
  }

  public addPerson(request: Person): Observable<ResponseApi>{
    return this.http.post<ResponseApi>(this.baseUrl, request);
  }

  public updatePerson(request: Person): Observable<ResponseApi>{
    const url = `${this.baseUrl}/update-using-valid-id-number`;
    return this.http.put<ResponseApi>(url, request);
  }

  public deletePerson(validIdNumber: string): Observable<ResponseApi>{
    const url = `${this.baseUrl}/use-valid-id-number/${validIdNumber}`;
    return this.http.delete<ResponseApi>(url);
  }

  public authenticate(request: Person): Observable<ResponseApi>{
    const url = `${this.baseUrl}/authenticate`;
    return this.http.post<ResponseApi>(url, request);
  }

  renewToken(request: TokenApi){
    const url = `${this.baseUrl}/refresh-token`;
    return this.http.post<ResponseApi>(url, request);
  }

  storeAccessToken(tokenValue: string){
    localStorage.setItem('secondary-accessToken', tokenValue);
  }

  getAccessToken(){
    return localStorage.getItem('secondary-accessToken');
  }


  storeRefreshToken(tokenValue: string){
    localStorage.setItem('secondary-refreshToken', tokenValue);
  }

  getRefreshToken(){
    return localStorage.getItem('secondary-refreshToken');
  }

  public updatePassword(request: Person): Observable<ResponseApi>{
    const url = `${this.baseUrl}/password`;
    return this.http.put<ResponseApi>(url, request);
  }

  public login(request: Person): Observable<ResponseApi>{
    const url = `${this.baseUrl}/authenticate`;
    return this.http.post<ResponseApi>(url, request);
  }
}
