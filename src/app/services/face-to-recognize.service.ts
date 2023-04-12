
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FaceToRecognize } from '../models/facetorecognize';
import { Person } from '../models/person';
import { ResponseApi } from '../models/response-api';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class FaceToRecognizeService {
  private baseUrl = environment.AttendaceManagementSystemAPIBaseUrl + 'api/FaceToRecognize';

  constructor(private http:HttpClient) { }

  add(request: FaceToRecognize): Observable<ResponseApi>{
    return this.http.post<ResponseApi>(this.baseUrl, request);
  }
}
