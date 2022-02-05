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
    expect(component).toBeTruthy();
  });

  it('should delete a row', () => {
    component.deleteRow(0);
    expect(mockDataService.removeCapture).toHaveBeenCalledWith(0);
  });
});
