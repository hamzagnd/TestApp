import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
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
  displayedColumns: string[] = ['username', 'email', 'first_name', 'last_name', 'permissions', 'actions'];
  dataSource: MatTableDataSource<any>;

  constructor(private dialog: MatDialog, private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.dataSource = new MatTableDataSource(users);
    }, error => {
      console.error('Error loading users:', error);
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
    const dialogRef = this.dialog.open(UserPermissionsComponent, {
      width: '400px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  canEditPermissions(user: any): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser.permissions.canEditUser && currentUser.permissions.level > user.permissions.level;
  }
}
