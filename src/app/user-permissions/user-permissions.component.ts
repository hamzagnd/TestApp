import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.css']
})
export class UserPermissionsComponent {
  user: any;

  constructor(
    public dialogRef: MatDialogRef<UserPermissionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = { ...data };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  savePermissions(): void {
    this.dialogRef.close(this.user); // Return the updated user object
  }
}
