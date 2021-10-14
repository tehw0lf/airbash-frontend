import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { Capture } from './types/capture';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getCaptures(): Observable<Capture[]> {
    return this.http.get<Capture[]>(`${environment.API_URL}/captures`);
  }

  getCapture(id: number): Observable<Capture> {
    return this.http.get<Capture>(`${environment.API_URL}/captures/${id}`);
  }

  deleteCapture(id: number): Observable<boolean> {
    return this.http
      .delete<void>(`${environment.API_URL}/captures/${id}`)
      .pipe(map(() => true));
  }

  editCapture(id: number, capture: Capture): Observable<boolean> {
    return this.http
      .put<void>(`${environment.API_URL}/captures/${id}`, capture)
      .pipe(map(() => true));
  }
}
