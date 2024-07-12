import { Component, Input, Output, OnInit, ViewChild, EventEmitter, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableData } from '../models/table-data.model';
import { ScenarioService } from '../scenario.service';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css']
})
export class GenericTableComponent<T extends { [key: string]: any }> implements OnInit, AfterViewInit {
  @Input() displayedColumns: string[] = [];
  @Input() dataSource: MatTableDataSource<TableData<T>> = new MatTableDataSource<TableData<T>>([]);
  @Output() rowClick = new EventEmitter<T>();

  newData: Partial<T> = {};

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private scenarioService: ScenarioService, public dialog: MatDialog) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      console.error('Paginator or Sort is undefined');
    }
  }

  addData() {
    const dataCopy: T = { ...this.newData } as T;
    this.scenarioService.addScenario(dataCopy).subscribe(
      response => {
        this.dataSource.data.push(new TableData(dataCopy));
        this.dataSource.data = [...this.dataSource.data];
        this.newData = {};
      },
      error => {
        console.error('Error adding scenario', error);
      }
    );
  }

  exportToPDF() {
    const doc = new jsPDF();
    const columns = this.displayedColumns.map(column => ({ title: column, dataKey: column }));
    const rows = this.dataSource.data.map((row: TableData<T>) => {
      const rowData: { [key: string]: any } = {};
      this.displayedColumns.forEach(column => {
        rowData[column] = row.data[column];
      });
      return rowData;
    });

    (doc as any).autoTable(columns, rows);
    doc.save('table.pdf');
  }

  onRowClick(row: TableData<T>) {
    this.rowClick.emit(row.data);
  }

  editRow(row: TableData<T>) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '250px',
      data: { row: { ...row.data }, displayedColumns: this.displayedColumns }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        row.data = { ...result };
        this.dataSource.data = [...this.dataSource.data];
      }
    });
  }
  runRow(element: TableData<T>) {
    // Run işlemlerini buraya ekleyin
    console.log('Run Row:', element);
  }

  getStateClass(state: string): string {
    if (state === 'geçti') {
      return 'passed-state';
    } else if (state === 'kaldı') {
      return 'failed-state';
    } else if (state === 'Test Edilmedi') {
      return 'not-run-state';
    } else {
      return '';
    }
  }
}
