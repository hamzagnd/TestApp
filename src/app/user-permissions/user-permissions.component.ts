import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.css']
})
export class UserPermissionsComponent {
  permissionsForm: FormGroup;
  user: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<UserPermissionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.user = data;
    this.permissionsForm = this.fb.group({
      canEditUser: [this.user.can_edit_user],
      canDeleteUser: [this.user.can_delete_user],
      canEditScenario: [this.user.can_edit_scenario],
      canDeleteScenario: [this.user.can_delete_scenario]
    });
  }

  savePermissions(): void {
    const updatedPermissions = this.permissionsForm.value;

    this.userService.updateUserPermissions({
      id: this.user.id,
      can_edit_user: updatedPermissions.canEditUser,
      can_delete_user: updatedPermissions.canDeleteUser,
      can_edit_scenario: updatedPermissions.canEditScenario,
      can_delete_scenario: updatedPermissions.canDeleteScenario
    }).subscribe(
      (response) => {
        this.dialogRef.close({ ...this.user, ...updatedPermissions });
        this.snackBar.open('Permissions updated successfully', 'Close', { duration: 3000 });
      },
      error => {
        console.error('Error updating permissions:', error);
        this.snackBar.open('Error updating permissions', 'Close', { duration: 3000 });
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
