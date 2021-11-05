import { TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { DataService } from './services/data.service';
import { TableEditorComponent } from './table-editor/table-editor.component';
import { mockCaptures } from './testdata/fixtures';
import { Capture } from './types/capture';

const mockDataService = {
  captures$: of<Capture[]>(mockCaptures),
  editCapture: jest.fn(),
  removeCapture: jest.fn(),
};

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent, TableEditorComponent],
      imports: [MatTableModule, MatIconModule, MatInputModule],
      providers: [{ provide: DataService, useValue: mockDataService }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
