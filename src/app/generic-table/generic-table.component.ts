import {
  Component,
  Input,
  Output,
  OnInit,
  ViewChild,
  EventEmitter,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  QueryList,
  ContentChildren, ElementRef
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TableData } from '../models/table-data.model';
import { ScenarioService } from '../scenario.service';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { ColumnDefinition, ColumnType } from '../column';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ColumnTemplateDirective } from '../ColumnTemplateDirective';
import { Router } from "@angular/router";
import { AuthService } from '../auth.service';
import { ExcelService } from "../excelService";
import html2canvas from "html2canvas";

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
  @Input() showFilter: boolean = false;
  @Input() showExpand: boolean = false;
  @Input() showSummit: boolean = false;

  newData: Partial<T> = {};

  errorMessage: string = '';

  sheetNames: string[] = [];
  selectedSheet: string = '';
  file: File | null = null;
  observedList: any[] = [];

  @Output() rowClick = new EventEmitter<T>();
  @Output() runTestClick = new EventEmitter<T>();

  @ContentChildren(ColumnTemplateDirective) columnTemplates: QueryList<ColumnTemplateDirective>;

  @ViewChild('customColumn') customColumnTemplate: TemplateRef<T>;
  @ViewChild('tableContainer') tableContainer: ElementRef;
  @ViewChild('donutChartContainer') donutChartContainer: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  length = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 100];
  displayedColumnKeys: string[] = [];
  columnTemplateMap = new Map<string, TemplateRef<any>>();
  expandedElement: T | null;

  constructor(
    private scenarioService: ScenarioService,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private excelService: ExcelService
  ) { }

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

    // Custom filter predicate
    this.dataSource.filterPredicate = (data: TableData<T>, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();
      return Object.values(data.data).some(value =>
        value !== null && value !== undefined && value.toString().toLowerCase().includes(transformedFilter));
    };
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
    const currentUser = this.authService.getCurrentUser();
    if (currentUser.is_superuser || currentUser.is_staff) {
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
    } else {
      this.errorMessage = 'You do not have permission to add scenarios.';
    }
  }

  exportToPDF() {
    const doc = new jsPDF();

    // Tablo başlığı
    doc.text('Scenario Report', 10, 10);

    const columns = this.columns.map(col => ({ title: col.header, dataKey: col.key }));

    // Senaryo veri satırları
    const rows = this.dataSource.data.map((row: TableData<T>) => {
      return this.columns.reduce((acc, col) => {
        acc[col.key] = row.data[col.key];
        return acc;
      }, {} as { [key: string]: any });
    });

    // Her senaryonun geçti, kaldı ve test edilmedi adımlarını hesaplayın
    const scenarioData = this.dataSource.data.map(row => {
      const name = row.data['name'];
      const geçti = this.dataSource.data.filter(item => item.data.name === name && item.data.durum === 'geçti').length;
      const kaldı = this.dataSource.data.filter(item => item.data.name === name && item.data.durum === 'kaldı').length;
      const testEdilmedi = this.dataSource.data.filter(item => item.data.name === name && item.data.durum === 'Test Edilmedi').length;
      return { name, geçti, kaldı, testEdilmedi };
    });

    // Senaryo veri satırlarına geçti, kaldı ve test edilmedi sütunlarını ekleyin
    rows.forEach(row => {
      const scenario = scenarioData.find(s => s.name === row.name);
      if (scenario) {
        row['Geçti'] = scenario.geçti;
        row['Kaldı'] = scenario.kaldı;
        row['Test Edilmedi'] = scenario.testEdilmedi;
      }
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
    if (this.authService.canEditScenario()) {
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
                this.dataSource.data[index] = new TableData<T>(result);
                this.dataSource.data = [...this.dataSource.data];
              },
              error => {
                console.error('Error editing scenario', error);
              }
            );
          } else {
            console.error('Row not found in dataSource');
          }
        }
      });
    } else {
      this.snackBar.open('You do not have permission to edit this scenario', 'Close', {
        duration: 3000,
      });
      console.error('You do not have permission to edit this scenario');
    }
  }

  deleteRow(row: TableData<T>) {
    if (this.authService.canDeleteScenario()) {
      if (confirm(`Are you sure you want to delete this scenario?`)) {
        this.scenarioService.deleteScenario(row.data.id).subscribe(
          response => {
            console.log('deleted successfully', response);
            this.dataSource.data = this.dataSource.data.filter(d => d.data.id !== row.data.id);
          },
          error => {
            console.error('Error deleting scenario', error);
          }
        );
      }
    } else {
      this.snackBar.open('You do not have permission to delete this scenario', 'Close', {
        duration: 3000,
      });
      console.error('You do not have permission to delete this scenario');
    }
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
    this.scenarioService.getScenarios();
    window.location.reload();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  protected readonly ColumnType = ColumnType;

}
