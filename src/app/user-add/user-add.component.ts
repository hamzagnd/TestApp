import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {
  userForm: FormGroup;
  successMessage: string;
  @Output() closeForm = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private userService: UserService, private dialogRef: MatDialogRef<UserAddComponent>) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.userForm.valid) {
      this.userService.addUser(this.userForm.value).subscribe(
        response => {
          this.successMessage = 'User added successfully';
          setTimeout(() => {
            this.dialogRef.close();
          }, 2000);
        },
        error => {
          console.error('Error adding user', error);
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
