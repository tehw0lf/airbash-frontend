import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ApiService } from './api.service';
import { DataService } from './data.service';
import { mockCaptures } from './testdata/fixtures';
import { Capture } from './types/capture';

const mockApiService = {
  getCaptures: jest.fn(() => of(mockCaptures)),
  updateCapture: jest.fn(() => of()),
  deleteCapture: jest.fn(() => of()),
};

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useValue: mockApiService }],
    });
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch captures', (done) => {
    service.captures$
      .pipe(
        tap((captures: Capture[]) => {
          expect(captures).toEqual(mockCaptures);
          done();
        })
      )
      .subscribe();
  });
});
