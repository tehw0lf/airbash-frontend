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
    const clickedSpan = clickEvent.target as HTMLSpanElement;
    const siblingInput = clickedSpan.previousSibling as HTMLInputElement;
    if (siblingInput.disabled && siblingInput.hidden) {
      siblingInput.disabled = false;
      siblingInput.hidden = false;

      clickedSpan.hidden = true;
    } else {
      siblingInput.disabled = false;
      siblingInput.hidden = false;

      clickedSpan.hidden = true;
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

  getRowValue(value: number | string): number | string {
    if (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      return '<no value>';
    }

    return value;
  }

  updateValueAndDisableField(
    row: Capture,
    fieldname: string,
    leaveEvent: Event
  ): void {
    const updatedValue: number | string = (
      leaveEvent.target as HTMLInputElement
    ).value;

    if (
      updatedValue !== null &&
      updatedValue !== undefined &&
      updatedValue.trim() !== '' &&
      updatedValue !== row[fieldname]
    ) {
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
