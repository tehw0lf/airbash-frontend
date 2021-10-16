import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { Capture } from './types/capture';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getCaptures(): Observable<Capture[]> {
    return this.http.get<Capture[]>(`${environment.API_URL}/captures`).pipe(
      catchError((error) => {
        throw `Failed to get captures: ${error}`;
      })
    );
  }

  updateCapture(capture: Capture): Observable<void> {
    if (capture.id >= 0) {
      return this.http
        .put<void>(`${environment.API_URL}/captures/${capture.id}`, capture)
        .pipe(
          catchError((error) => {
            throw `Failed to update capture: ${error}`;
          })
        );
    } else {
      throw new Error(`Capture id needs to be 0 or higher. Was ${capture.id}`);
    }
  }

  deleteCapture(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.API_URL}/captures/${id}`).pipe(
      catchError((error) => {
        throw `Failed to delete capture ${id}: ${error}`;
      })
    );
  }
}
