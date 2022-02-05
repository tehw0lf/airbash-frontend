import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DataService } from '../services/data.service';
import { Capture } from '../types/capture';

@Component({
  selector: 'airbash-frontend-table-editor',
  templateUrl: './table-editor.component.html',
  styleUrls: ['./table-editor.component.scss'],
})
export class TableEditorComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'id',
    'latitude',
    'longitude',
    'bssid',
    'essid',
    'psk',
    'pmkid',
    'processed',
    'delete',
  ];
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

  enableAndShowInputField(clickEvent: Event): void {
    const span = (clickEvent.target as HTMLSpanElement).lastElementChild
      ? ((clickEvent.target as HTMLElement).lastElementChild as HTMLSpanElement)
      : (clickEvent.target as HTMLSpanElement);

    const input = (clickEvent.target as HTMLElement).firstElementChild
      ? ((clickEvent.target as HTMLElement)
          .firstElementChild as HTMLInputElement)
      : (span.previousElementSibling as HTMLInputElement);
    if (input !== null) {
      if (input.disabled && input.hidden) {
        input.disabled = false;
        input.hidden = false;

        span.hidden = true;
      }
    }
  }

  disableAndHideInputField(leaveEvent: Event): void {
    const leftInputElement = leaveEvent.target as HTMLInputElement;
    const siblingSpan = leftInputElement.nextSibling as HTMLSpanElement;

    if (!leftInputElement.disabled && !leftInputElement.hidden) {
      setTimeout(() => {
        leftInputElement.disabled = true;
        leftInputElement.hidden = true;
        siblingSpan.hidden = false;
      }, 100);
    }
  }
  deleteRow(rowId: number): void {
    this.dataService
      .removeCapture(rowId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  updateValueAndDisableField(
    row: Capture,
    fieldname: string,
    leaveEvent: Event
  ): void {
    const updatedValue: number | string = (
      leaveEvent.target as HTMLInputElement
    ).value;

    if (updatedValue !== row[fieldname]) {
      const updatedCapture = row;
      updatedCapture[fieldname] = updatedValue;

      this.dataService
        .editCapture(updatedCapture)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe();
    }

    this.disableAndHideInputField(leaveEvent);
  }
}
