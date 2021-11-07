import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { of } from 'rxjs';

import { DataService } from '../services/data.service';
import { mockCaptures } from '../testdata/fixtures';
import { Capture } from '../types/capture';
import { TableEditorComponent } from './table-editor.component';

const mockDataService = {
  captures$: of<Capture[]>(mockCaptures),
  editCapture: jest.fn(),
  removeCapture: jest.fn(),
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
    expect(component).toBeTruthy();
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
});
