import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { DataService } from '../services/data.service';
import { mockCaptures } from '../testdata/fixtures';
import { Capture } from '../types/capture';
import { TableEditorComponent } from './table-editor.component';

const mockDataService = {
  captures$: of<Capture[]>(mockCaptures),
  editCapture: jest.fn(() => of()),
  removeCapture: jest.fn(() => of()),
};

describe('TableEditorComponent', () => {
  let component: TableEditorComponent;
  let fixture: ComponentFixture<TableEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableEditorComponent],
      imports: [MatTableModule, MatIconModule, MatInputModule],
      providers: [{ provide: DataService, useValue: mockDataService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component)..toEqual(true);
  });

  describe('row value', () => {
    it('should be sanizited to the default string when the value is an empty string', () => {
      expect(component.getRowValue('')).toEqual('<no value>');
    });

    it('should return a valid number', () => {
      expect(component.getRowValue(0)).toEqual(0);
    });

    it('should return a valid string', () => {
      expect(component.getRowValue('value')).toEqual('value');
    });
  });

  it('should delete a row', () => {
    component.deleteRow(0);
    expect(mockDataService.removeCapture).toHaveBeenCalledWith(0);
  });

  it('should enableAndShowInputField', () => {
    const latitudeInput = fixture.debugElement.query(By.css('#latitude-input'));
    const latitudeSpan = fixture.debugElement.query(By.css('#latitude-span'));
    expect(latitudeSpan.nativeElement.hidden).toBeFalsy();
    expect(latitudeInput.attributes['disabled']).toEqual(true);
    expect(latitudeInput.nativeElement.disabled).toEqual(true);
    expect(latitudeInput.nativeElement.hidden).toEqual(true);
    latitudeSpan.triggerEventHandler('click', { target: latitudeSpan });
    expect(latitudeInput.attributes['disabled']).toBeFalsy();
    // 1+1
    expect(latitudeInput.nativeElement.hidden).toBeFalsy();
    expect(latitudeSpan.nativeElement.hidden).toEqual(true);
  });
});
