import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../models/response-api';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class FaceExpressionService {
  private baseUrl = environment.FaceRecongtionAPIBaseUrl + 'api/FaceExpression';
  constructor(private http:HttpClient) { }

  getAll(): Observable<ResponseApi>{
    return this.http.get<ResponseApi>(this.baseUrl);
  }

}
