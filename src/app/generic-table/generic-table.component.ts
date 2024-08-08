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
  ContentChildren,
  ElementRef
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
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import * as XLSX from 'xlsx';
import { ColumnTemplateDirective } from '../ColumnTemplateDirective';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import {TDocumentDefinitions} from "pdfmake/interfaces";

import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
  @Input() showUploadButton: boolean = false;

  newData: Partial<T> = {};
  errorMessage: string = '';
  @Output() rowClick = new EventEmitter<T>();
  @Output() runTestClick = new EventEmitter<T>();

  @ContentChildren(ColumnTemplateDirective) columnTemplates: QueryList<ColumnTemplateDirective>;
  @ViewChild('customColumn') customColumnTemplate: TemplateRef<T>;
  @ViewChild('tableContainer') tableContainer: ElementRef;
  @ViewChild('donutChartContainer') donutChartContainer: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('excelInput') excelInput: ElementRef;

  length = 0;
  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 100];
  displayedColumnKeys: string[] = [];
  columnTemplateMap = new Map<string, TemplateRef<any>>();
  sheetNames: string[] = [];
  selectedSheetName: string = '';

  constructor(
    private scenarioService: ScenarioService,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  ngAfterContentInit() {
    this.columnTemplates.forEach(template => {
      this.columnTemplateMap.set(template.columnName, template.templateRef);
    });
  }


  getTemplateForColumn(columnKey: string): TemplateRef<any> | null {
    return this.columnTemplateMap.get(columnKey) || null;
  }

  ngOnInit(): void {
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

  /*exportToPDF() {
    const steps = this.dataSource.data.flatMap(item => item.data.steps);
    const failedSteps = steps.filter(step => step.durum && step.durum.toLowerCase() === 'kaldı');
    const notTestedSteps = steps.filter(step => step.durum && step.durum.toLowerCase() === 'test edilmedi');

    const countFailed = failedSteps.length;
    const countNotTested = notTestedSteps.length;

    const doc = new jsPDF();
    doc.text('Failed Steps Report', 14, 16);

    doc.text(`Kaldı Toplam Sayı: ${countFailed}`, 14, 26);
    doc.text(`Test Edilmedi Toplam Sayı: ${countNotTested}`, 14, 36);

    (doc as any).autoTable({
      head: [['VTD Madde NO', 'State', 'Yorum']],
      body: failedSteps.map(step => [step.vtd_madde_no || 'Bilinmiyor', step.durum || 'Bilinmiyor', step.yorum || 'Bilinmiyor']),
      startY: 46,
      margin: { top: 20 }
    });

    doc.save('report.pdf');
  }*/

  exportToPDF() {
    const steps = this.dataSource.data.flatMap(item => item.data.steps);
    const failedSteps = steps.filter(step => step.durum && step.durum.toLowerCase() === 'kaldı');
    const notTestedSteps = steps.filter(step => step.durum && step.durum.toLowerCase() === 'test edilmedi');

    const countFailed = failedSteps.length;
    const countNotTested = notTestedSteps.length;

    const docDefinition = {
      content: [
        { text: 'Failed Steps Report', style: 'header' },
        { text: `Kaldı Toplam Sayı: ${countFailed}`, margin: [0, 10] },
        { text: `Test Edilmedi Toplam Sayı: ${countNotTested}`, margin: [0, 10] },
        {
          table: {
            headerRows: 1,
            body: [
              ['VTD Madde NO', 'State', 'Yorum'],
              ...failedSteps.map(step => [
                step.vtd_madde_no || 'Bilinmiyor',
                step.durum || 'Bilinmiyor',
                step.yorum || 'Bilinmiyor'
              ])
            ]
          },
          layout: 'lightHorizontalLines'
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        }
      }
    } as TDocumentDefinitions;

    pdfMake.createPdf(docDefinition, null, null, pdfFonts.pdfMake.vfs)
      .download('failed-steps-report.pdf');
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
        data: { row: { ...row.data }, displayedColumns: this.columns.filter(c => c.type === ColumnType.STRING).map(c => c.key) }
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
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  protected readonly ColumnType = ColumnType;

  triggerExcelUpload(): void {
    this.excelInput.nativeElement.click();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        this.sheetNames = workbook.SheetNames;
      };
      reader.readAsArrayBuffer(file);
    }
  }

  onUpload(): void {
    const fileInputElement = this.excelInput.nativeElement as HTMLInputElement;
    const file = fileInputElement.files ? fileInputElement.files[0] : null;
    if (file && this.selectedSheetName) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sheet_name', this.selectedSheetName);
      this.scenarioService.uploadExcel(file, this.selectedSheetName).subscribe(
        response => {
          console.log('Excel uploaded successfully', response);
          this.snackBar.open('Excel uploaded successfully', 'Close', { duration: 3000 });
          this.refreshTable();
        },
        error => {
          console.error('Error uploading Excel file', error);
          this.snackBar.open('Error uploading Excel file', 'Close', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('Please select a file and a sheet name.', 'Close', { duration: 3000 });
    }
  }

}
