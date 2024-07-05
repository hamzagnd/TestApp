import { Component, Input,Output, OnInit, ViewChild,EventEmitter, AfterViewInit } from '@angular/core';
import { NewMatTableDatasource } from '../new-mat-table-datasource';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableData } from '../models/table-data.model';
import jsPDF from 'jspdf';
import 'jspdf-autotable'

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css']
})
export class GenericTableComponent<T extends { [key: string]: any }> implements OnInit, AfterViewInit {
  @Input() displayedColumns: string[] = [];
  @Input({}) dataSource!: NewMatTableDatasource<TableData<T>>;
  newData: Partial<T> = {};
  @Output() rowClick = new EventEmitter<T>();


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addData() {
    const dataCopy: T = { ...this.newData } as T;
    this.dataSource.data.push(new TableData(dataCopy));
    this.dataSource.data = [...this.dataSource.data];
    this.newData = {};
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
    console.log('Düzenlenen satır:', row);
  }


}
