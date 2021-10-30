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

  enableInputField(clickEvent: Event): void {
    const clickedInputElement = clickEvent.target as HTMLInputElement;
    if (clickedInputElement.disabled) {
      clickedInputElement.disabled = false;
    }
  }

  disableInputField(clickEvent: Event): void {
    const clickedElement = clickEvent.target as HTMLElement;
    const inputElement = clickedElement.firstChild as HTMLInputElement;
    if (!inputElement.disabled) {
      setTimeout(() => {
        inputElement.disabled = true;
      }, 100);
    }
  }

  delete(rowId: number) {
    return this.dataService
      .removeCapture(rowId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  updateValue(row: Capture, fieldname: string, inputChangedEvent: Event): void {
    const updatedValue = (inputChangedEvent.target as HTMLInputElement).value;
    if (updatedValue !== null && updatedValue !== undefined) {
      const updatedCapture = row;
      updatedCapture[fieldname] = updatedValue;

      this.dataService
        .editCapture(updatedCapture)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe();
    }
  }
}
