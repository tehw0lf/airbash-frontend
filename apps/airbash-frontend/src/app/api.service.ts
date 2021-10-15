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

  editCapture(capture: Capture): Observable<void> {
    if (capture.id >= 0) {
      return this.http.put<void>(
        `${environment.API_URL}/captures/${capture.id}`,
        capture
      );
    } else {
      throw new Error('Capture without id cannot be matched');
    }
  }

  deleteCapture(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.API_URL}/captures/${id}`);
  }
}
