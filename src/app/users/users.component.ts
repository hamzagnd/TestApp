import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserAddComponent } from '../user-add/user-add.component';
import { UserService } from '../user.service';
import { UserPermissionsComponent } from '../user-permissions/user-permissions.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['username', 'email', 'first_name', 'last_name', 'status', 'permissions', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);

  constructor(private dialog: MatDialog, private userService: UserService, private authService: AuthService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(UserAddComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers(); // Reload users after adding a new user
      }
    });
  }

  openPermissionsModal(user: any): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser.is_superuser || (currentUser.is_staff && !user.is_superuser)) {
      const dialogRef = this.dialog.open(UserPermissionsComponent, {
        width: '400px',
        data: user
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadUsers(); // Reload users after updating permissions
        }
      });
    } else {
      this.snackBar.open('You do not have permission to edit this user', 'Close', { duration: 3000 });
    }
  }

  canEditPermissions(user: any): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser.is_superuser || (currentUser.is_staff && !user.is_superuser);
  }

  canDeleteUser(user: any): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser.is_superuser || (currentUser.is_staff && !user.is_superuser && !user.is_staff);
  }

  deleteUser(user: any): void {
    if (this.canDeleteUser(user)) {
      if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
        this.userService.deleteUser(user.id).subscribe(() => {
          this.loadUsers(); // Reload users after deleting
          this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
        }, error => {
          console.error('Error deleting user', error);
          this.snackBar.open('Error deleting user', 'Close', { duration: 3000 });
        });
      }
    } else {
      this.snackBar.open('You do not have permission to delete this user', 'Close', { duration: 3000 });
    }
  }
}
