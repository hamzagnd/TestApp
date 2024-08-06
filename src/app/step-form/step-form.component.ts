import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-step-form',
  templateUrl: './step-form.component.html',
  styleUrls: ['./step-form.component.css']
})
export class StepFormComponent implements OnInit {
  stepForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<StepFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.stepForm = this.fb.group({
      vtd_madde_no: [this.data?.step?.vtd_madde_no || '', Validators.required],
      topoloji: [this.data?.step?.topoloji || '', Validators.required], 
      testAdimlari: [this.data?.step?.testAdimlari || '', Validators.required],
      kabulKriteri: [this.data?.step?.kabulKriteri || '', Validators.required],
      durum: [this.data?.step?.durum || ''],
      //yorum: [this.data?.step?.yorum || '']
    });
  }

  onSave(): void {
    if (this.stepForm.valid) {
      this.dialogRef.close(this.stepForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
