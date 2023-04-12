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
export class FaceRecognitionService {
  private baseUrl = environment.AttendaceManagementSystemAPIBaseUrl + 'api/FaceRecognitionService';

  constructor(private http:HttpClient) { }

  recognizeFace(face: FaceToRecognize): Observable<ResponseApi>{
    const url = `${this.baseUrl}/recognize-face/${face.id}`;
    return this.http.get<ResponseApi>(url);
  }

  trainModel(): Observable<ResponseApi>{
    const url = `${this.baseUrl}/train-model`;
    return this.http.get<ResponseApi>(url);
  }
}
