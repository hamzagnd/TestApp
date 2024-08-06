import { Component } from '@angular/core';
import { ExcelUploadService } from '../excel-upload.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-excel-upload',
  templateUrl: './excel-upload.component.html',
  styleUrls: ['./excel-upload.component.css']
})
export class ExcelUploadComponent {
  selectedFile: File;
  sheetNames: string[] = [];
  selectedSheetName: string;
  errorMessage: string;

  constructor(private excelUploadService: ExcelUploadService) {}

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        this.sheetNames = workbook.SheetNames;
      };
      reader.readAsArrayBuffer(this.selectedFile);
    }
  }

  onUpload(): void {
    if (this.selectedFile && this.selectedSheetName) {
      this.excelUploadService.uploadExcel(this.selectedFile, this.selectedSheetName).subscribe(
        response => {
          console.log('Excel file uploaded successfully:', response);
          // Başarılı yükleme sonrası senaryoları ve adımları yeniden yüklemek için ek işlemler yapabilirsiniz
        },
        error => {
          console.error('Error uploading Excel file:', error);
          this.errorMessage = 'Error uploading Excel file.';
        }
      );
    } else {
      this.errorMessage = 'Please select a file and a sheet name.';
    }
  }
}
