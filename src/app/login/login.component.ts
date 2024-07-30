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
  hidePassword: boolean = true; // Şifreyi gizle/göster için değişken
  errorMessage: string = ''; // Hata mesajı için değişken

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
      this.authService.login(this.loginForm.value).subscribe(
        response => {
          if (response && response.message === 'Login successful') {
            this.router.navigate(['/test']);  // Başarılı girişten sonra test sayfasına yönlendir
          } else {
            this.errorMessage = 'Login failed';
            console.error('Login failed');
          }
        },
        error => {
          this.errorMessage = 'Kullanıcı bilginiz veya şifreniz hatalı, tekrar deneyiniz.';
          console.error('Login error:', error);
        }
      );
    } else {
      this.errorMessage = 'Form is invalid';
      console.error('Form is invalid');
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
