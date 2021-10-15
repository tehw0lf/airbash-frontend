import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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

  editCapture(capture: Capture): Observable<void> {
    return this.apiService.updateCapture(capture).pipe(
      tap(() => {
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
      })
    );
  }

  deleteCapture(id: number): Observable<void> {
    return this.apiService.deleteCapture(id).pipe(
      tap(() => {
        const updatedCaptures = this.capturesSubject.value.filter(
          (capture: Capture) => capture.id !== id
        );
        this.capturesSubject.next(updatedCaptures);
      })
    );
  }

  private fetchCaptures(): void {
    this.apiService
      .getCaptures()
      .pipe(tap((captures: Capture[]) => this.capturesSubject.next(captures)))
      .subscribe();
  }
}
