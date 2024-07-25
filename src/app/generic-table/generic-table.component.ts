import { Component, Input, Output, OnInit, ViewChild, EventEmitter, AfterViewInit, OnChanges, SimpleChanges, TemplateRef, QueryList, ContentChildren } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TableData } from '../models/table-data.model';
import { ScenarioService } from '../scenario.service';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { ColumnDefinition, ColumnType } from '../column';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ColumnTemplateDirective } from '../ColumnTemplateDirective';
import {Router} from "@angular/router";

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css']
})
export class GenericTableComponent<T extends { [key: string]: any }> implements OnInit, AfterViewInit, OnChanges {
  @Input() columns: ColumnDefinition[] = [];
  @Input() dataSource: MatTableDataSource<TableData<T>> = new MatTableDataSource<TableData<T>>([]);
  @Input() showAddDataForm: boolean = false;
  @Input() showExportButton: boolean = false;
  @Input() showRefreshButton: boolean = false;

  newData: Partial<T> = {};


  @Output() rowClick = new EventEmitter<T>();
  @Output() runTestClick = new EventEmitter<T>();

  @ContentChildren(ColumnTemplateDirective) columnTemplates: QueryList<ColumnTemplateDirective>;

  @ViewChild('addDataTemplate') addDataTemplate: TemplateRef<any>;
  @ViewChild('exportTemplate') exportTemplate: TemplateRef<any>;
  @ViewChild('customColumn') customColumnTemplate: TemplateRef<T>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  length = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 20];
  displayedColumnKeys: string[] = [];
  columnTemplateMap = new Map<string, TemplateRef<any>>();  //@Input() customColumnTemplate!: TemplateRef<any>;

  constructor(private scenarioService: ScenarioService,private router: Router, public dialog: MatDialog) {}

  ngAfterContentInit() {
    this.columnTemplates.forEach(template => {
      this.columnTemplateMap.set(template.columnName, template.templateRef);
    });
  }
  getTemplateForColumn(columnKey: string): TemplateRef<any> | null {
    return this.columnTemplateMap.get(columnKey) || null;
  }

  ngOnInit(): void {
    //this.fetchScenarios();
  }

  ngAfterViewInit(): void {
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      console.error('Paginator or Sort is undefined');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns']) {
      this.displayedColumnKeys = this.columns.map(c => c.key).concat('edit');
    }
  }

  fetchScenarios(): void {
    this.scenarioService.getScenarios().subscribe(
      scenarios => {
        this.dataSource.data = scenarios.map(scenario => new TableData(scenario));
        this.length = this.dataSource.data.length;
      },
      error => {
        console.error('Error fetching scenarios', error);
      }
    );
  }


  addData() {
    const dataCopy: T = { ...this.newData } as T;
    this.scenarioService.addScenario(dataCopy).subscribe(
      response => {
        this.dataSource.data.push(new TableData(dataCopy));
        this.dataSource.data = [...this.dataSource.data];
        this.newData = {};
        this.length = this.dataSource.data.length;
      },
      error => {
        console.error('Error adding scenario', error);
      }
    );
  }

  exportToPDF() {
    const doc = new jsPDF();
    const columns = this.columns.map(column => ({ title: column.header, dataKey: column.key }));
    const rows = this.dataSource.data.map((row: TableData<T>) => {
      const rowData: { [key: string]: any } = {};
      this.columns.forEach(column => {
        rowData[column.key] = row.data[column.key];
      });
      return rowData;
    });

    (doc as any).autoTable(columns, rows);
    doc.save('table.pdf');
  }

  onRowClick(row: TableData<T>) {
    this.rowClick.emit(row.data);
  }

  onRunTestClick(element: any): void {
    this.runTestClick.emit(element);
  }

  editRow(row: TableData<T>) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '250px',
      data: { row: { ...row.data }, displayedColumns: this.columns.map(c => c.key) }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Result:', result);
        const index = this.dataSource.data.findIndex(d => d.data.id === row.data.id);
        if (index !== -1) {
          this.scenarioService.updateScenario(row.data.id, result).subscribe(
            response => {
              console.log('edited successfully', response);
            },
            error => {
              console.error('Error editing scenario', error);
            }
          );
          this.dataSource.data[index] = new TableData<T>(result);
          this.dataSource.data = [...this.dataSource.data];
        } else {
          console.error('Row not found in dataSource');
        }
      }
    });
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

  refreshTable(): void {
    //this.getScenarios();
  }

}
