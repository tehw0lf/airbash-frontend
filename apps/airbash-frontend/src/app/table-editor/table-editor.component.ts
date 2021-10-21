import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DataService } from '../data.service';
import { Capture } from '../types/capture';

@Component({
  selector: 'airbash-frontend-table-editor',
  templateUrl: './table-editor.component.html',
  styleUrls: ['./table-editor.component.scss'],
})
export class TableEditorComponent implements OnInit, OnDestroy {
  data$: Observable<Capture[]> = of([]);
  unsubscribe$: Subject<void> = new Subject();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.data$ = this.dataService.captures$.pipe(takeUntil(this.unsubscribe$));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
