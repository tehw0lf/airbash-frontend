import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { mockCaptures } from '../testdata/fixtures';
import { Capture } from '../types/capture';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get captures', (done) => {
    service
      .getCaptures()
      .pipe(
        tap((captures: Capture[]) => {
          expect(captures).toEqual(mockCaptures);
          done();
        })
      )
      .subscribe();

    const request = httpMock.expectOne(`${environment.API_URL}/captures`);

    expect(request.request.method).toEqual('GET');

    request.flush(mockCaptures);
  });
});
