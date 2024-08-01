import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-change-password',
  templateUrl: './user-change-password.component.html',
  styleUrls: ['./user-change-password.component.css']
})
export class UserChangePasswordComponent {
  changePasswordForm: FormGroup;
  hideOld = true;
  hideNew = true;
  hideConfirm = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<UserChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.changePasswordForm = this.fb.group({
      current_password: ['', Validators.required],
      new_password: ['', Validators.required],
      confirm_new_password: ['', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  changePassword(): void {
    if (this.changePasswordForm.valid) {
      const passwords = this.changePasswordForm.value;
      this.userService.changePassword(passwords).subscribe(
        (response) => {
          this.snackBar.open('Password changed successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        (error) => {
          this.snackBar.open('Error changing password', 'Close', { duration: 3000 });
          console.error('Error changing password:', error);
        }
      );
    } else {
      this.snackBar.open('Please fill out the form correctly', 'Close', { duration: 3000 });
    }
  }
}
