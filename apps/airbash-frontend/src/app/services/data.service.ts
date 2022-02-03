import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Capture } from '../types/capture';
import { ApiService } from './api.service';

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
    return this.apiService.updateCapture(this.serializeValues(capture)).pipe(
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

  removeCapture(id: number): Observable<void> {
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
      .pipe(
        tap((captures: Capture[]) => this.capturesSubject.next(captures)),
        map((captures: Capture[]) => this.deserializeValues(captures))
      )
      .subscribe();
  }

  private serializeValues(capture: Capture): Capture {
    Object.keys(capture).forEach((key: string) => {
      const value = capture[key];
      if (
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value === '<no value>')
      ) {
        capture[key] = '';
      }
      capture[key] = value;
    });
    return capture;
  }

  private deserializeValues(captures: Capture[]): Capture[] {
    captures.forEach((capture: Capture) => {
      Object.keys(capture).forEach((key: string) => {
        const value = capture[key];
        if (
          value === null ||
          value === undefined ||
          (typeof value === 'string' && value.trim() === '')
        ) {
          capture[key] = '<no value>';
        } else {
          capture[key] = value;
        }
      });
    });
    return captures;
  }
}
