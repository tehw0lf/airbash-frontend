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

  enableAndShowInputField(clickEvent: Event): void {
    const clickedSpan = clickEvent.target as HTMLSpanElement;
    const siblingInput = clickedSpan.previousSibling as HTMLInputElement;
    if (siblingInput.disabled && siblingInput.hidden) {
      siblingInput.disabled = false;
      siblingInput.hidden = false;

      clickedSpan.hidden = true;
    }
  }

  disableAndHideInputField(leaveEvent: Event): void {
    const leftInputElement = leaveEvent.target as HTMLInputElement;
    const siblingSpan = leftInputElement.nextSibling as HTMLSpanElement;

    console.log(leftInputElement);
    console.log(leftInputElement.defaultValue);
    console.log(leftInputElement.value);

    if (
      leftInputElement.defaultValue !== leftInputElement.value &&
      leftInputElement.value !== '<no value>'
    ) {
      leftInputElement.dispatchEvent(new Event('change'));
    }

    if (!leftInputElement.disabled && !leftInputElement.hidden) {
      setTimeout(() => {
        leftInputElement.disabled = true;
        leftInputElement.hidden = true;
        siblingSpan.hidden = false;
      }, 100);
    }
  }

  delete(rowId: number): void {
    this.dataService
      .removeCapture(rowId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  updateValue(row: Capture, fieldname: string, inputChangedEvent: Event): void {
    const updatedValue: number | string = (
      inputChangedEvent.target as HTMLInputElement
    ).value;
    if (
      updatedValue !== null &&
      updatedValue !== undefined &&
      updatedValue.trim() !== ''
    ) {
      const updatedCapture = row;
      updatedCapture[fieldname] = updatedValue;

      this.dataService
        .editCapture(updatedCapture)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe();
    }
  }
}
