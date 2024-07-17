import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Login form submitted:', this.loginForm.value);  // Debugging line
      this.authService.login(this.loginForm.value).subscribe(
        response => {
          console.log('Login response:', response);  // Debugging line
          if (response && response.message === 'Login successful') {
            this.router.navigate(['/test']);  // Navigate after successful login
          } else {
            console.error('Login failed');
          }
        },
        error => {
          console.error('Login error:', error);
        }
      );
    }
  }
}
