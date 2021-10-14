import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ApiService } from './api.service';
import { Capture } from './types/capture';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private capturesSubject: BehaviorSubject<Capture[]> = new BehaviorSubject<
    Capture[]
  >([]);
  captures$: Observable<Capture[]> = this.capturesSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.fetchCaptures();
  }

  updateCapture(id: number, capture: Capture): Observable<boolean> {
    return this.apiService.editCapture(id, capture).pipe(
      map(() => true),
      tap((successful: boolean) => {
        if (successful) {
          const updatedCaptures = this.capturesSubject.value.map<Capture>(
            (currentCapture: Capture) => {
              if (currentCapture.id === capture.id) {
                return capture;
              } else {
                return currentCapture;
              }
            }
          );
          this.capturesSubject.next(updatedCaptures);
          return true;
        }
        return false;
      })
    );
  }

  deleteCapture(id: number): Observable<boolean> {
    return this.apiService.deleteCapture(id).pipe(map(() => true));
  }

  private fetchCaptures(): void {
    this.apiService
      .getCaptures()
      .pipe(tap((captures: Capture[]) => this.capturesSubject.next(captures)));
  }
}
