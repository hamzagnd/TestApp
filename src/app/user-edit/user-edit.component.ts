import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<UserEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.editForm = this.fb.group({
      username: [this.data.username, Validators.required],
      email: [{ value: this.data.email, disabled: true }, [Validators.required, Validators.email]],
      first_name: [this.data.first_name, Validators.required],
      last_name: [this.data.last_name, Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateUser(): void {
    if (this.editForm.valid) {
      const updatedUser = {
        id: this.data.id,
        username: this.editForm.get('username')?.value,
        email: this.editForm.get('email')?.value,
        first_name: this.editForm.get('first_name')?.value,
        last_name: this.editForm.get('last_name')?.value
      };

      this.userService.updateUser(updatedUser).subscribe(
        (response) => {
          this.dialogRef.close(updatedUser);
          this.snackBar.open('User information updated successfully', 'Close', { duration: 3000 });
        },
        (error) => {
          console.error('Error updating user information:', error);
          this.snackBar.open('Error updating user information', 'Close', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('Please fill out the form correctly', 'Close', { duration: 3000 });
    }
  }
}
