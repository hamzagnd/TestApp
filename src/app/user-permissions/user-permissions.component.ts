import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.css']
})
export class UserPermissionsComponent implements OnInit {
  permissionsForm: FormGroup;
  user: any;
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<UserPermissionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.user = data;
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.permissionsForm = this.fb.group({
      status: [this.user.is_superuser ? 'superuser' : (this.user.is_staff ? 'staff' : 'active')],
      canEditUser: [{ value: this.user.can_edit_user, disabled: true }],
      canDeleteUser: [{ value: this.user.can_delete_user, disabled: true }],
      canEditScenario: [{ value: this.user.can_edit_scenario, disabled: true }],
      canDeleteScenario: [{ value: this.user.can_delete_scenario, disabled: true }]
    });
    this.onStatusChange();
  }

  onStatusChange(): void {
    const status = this.permissionsForm.value.status;
    if (status === 'staff') {
      this.permissionsForm.patchValue({
        canEditUser: false,
        canDeleteUser: false,
        canEditScenario: true,
        canDeleteScenario: true
      });
    } else {
      this.permissionsForm.patchValue({
        canEditUser: false,
        canDeleteUser: false,
        canEditScenario: false,
        canDeleteScenario: false
      });
    }
  }

  savePermissions(): void {
    const updatedPermissions = this.permissionsForm.value;

    // Staff kullanıcıları superuser yapamaz
    if (updatedPermissions.status === 'superuser' && !this.currentUser.is_superuser) {
      this.snackBar.open('Only superusers can grant superuser status', 'Close', { duration: 3000 });
      return;
    }

    this.userService.updateUserPermissions({
      id: this.user.id,
      is_superuser: updatedPermissions.status === 'superuser',
      is_staff: updatedPermissions.status === 'staff',
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
