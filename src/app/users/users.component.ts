import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserAddComponent } from '../user-add/user-add.component';
import { UserService } from '../user.service';
import { UserPermissionsComponent } from '../user-permissions/user-permissions.component';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { UserChangePasswordComponent } from '../user-change-password/user-change-password.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['username', 'email', 'first_name', 'last_name', 'status', 'permissions', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog, private userService: UserService, public authService: AuthService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = this.sortUsers(users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  sortUsers(users: any[]): any[] {
    const currentUser = this.authService.getCurrentUser();
    return users.sort((a, b) => {
      if (a.id === currentUser.id) return -1;
      if (b.id === currentUser.id) return 1;

      if (a.is_superuser !== b.is_superuser) return a.is_superuser ? -1 : 1;
      if (a.is_staff !== b.is_staff) return a.is_staff ? -1 : 1;
      
      return a.username.localeCompare(b.username);
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
    if (currentUser.is_superuser) {
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
    return currentUser.is_superuser;
  }

  canDeleteUser(user: any): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser.is_superuser && user.id !== currentUser.id;
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

  openEditUserDialog(user: any): void {
    const dialogRef = this.dialog.open(UserEditComponent, {
      width: '400px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers(); // Reload users after updating user information
      }
    });
  }

  openChangePasswordDialog(user: any): void {
    const dialogRef = this.dialog.open(UserChangePasswordComponent, {
      width: '400px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Password changed successfully', 'Close', { duration: 3000 });
      }
    });
  }
}
