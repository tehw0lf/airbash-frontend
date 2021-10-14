import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  editCapture(id: number, capture: Capture): Observable<void> {
    return this.http.put<void>(
      `${environment.API_URL}/captures/${id}`,
      capture
    );
  }

  deleteCapture(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.API_URL}/captures/${id}`);
  }
}
