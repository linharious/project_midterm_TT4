import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  errorMsg = '';
  email = '';
  password = '';

  constructor(
    private readonly router: Router,
    private readonly auth: Auth,
  ) {}

  ngOnInit() {
    this.auth.clearToken();
  }

  submit() {
    this.errorMsg = '';

    if (!this.email || !this.email.trim()) {
      this.errorMsg = 'Please enter your email address.';
      return;
    }

    if (!this.password) {
      this.errorMsg = 'Please enter your password.';
      return;
    }

    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        console.log(res);
        this.errorMsg = '';
        this.auth.setToken(res.token);
        this.auth.setCurrentUser(res.user);
        this.cdr.detectChanges();
        this.router.navigate(['/jobs']);
      },
      error: (err) => {
        console.error(err);
        if (err.status === 401 || err.status === 404) {
          this.errorMsg = 'Incorrect email or password.';
        } else if (err.error && err.error.message) {
          this.errorMsg = err.error.message;
        } else {
          this.errorMsg = 'Failed to log in. Please try again later.';
        }
        this.cdr.detectChanges();
      },
    });
  }

  continueAsGuest() {
    this.auth.clearToken();
    this.router.navigate(['/jobs/search']);
  }
}
