import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  name = '';
  username = '';
  email = '';
  password = '';
  bio = '';
  errorMsg = '';
  suggestedUsername = '';
  skillsStr = '';
  private cdr = inject(ChangeDetectorRef);
  constructor(
    private readonly auth: Auth,
    private readonly router: Router,
  ) {}

  submit() {
    this.errorMsg = '';
    this.suggestedUsername = '';

    if (!this.name || !this.username || !this.email || !this.password) {
      this.errorMsg = 'Name, username, email, and password are required.';
      return;
    }

    const skillsArray = this.skillsStr
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    this.auth
      .register(this.name, this.username, this.email, this.password, this.bio, skillsArray)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/login']);
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMsg = err.error.error;
          console.error(err);
          if (err.error && err.error.message) {
            this.errorMsg = err.error.message;
          } else if (err.error && err.error.error) {
            this.errorMsg = err.error.error;
          } else {
            this.errorMsg = 'Failed to register. Please try again.';
          }

          if (err.error && err.error.suggested_username) {
            this.suggestedUsername = err.error.suggested_username;
          } else if (
            err.status === 409 ||
            err.status === 400 ||
            (err.error &&
              typeof err.error.error === 'string' &&
              err.error.error.toLowerCase().includes('already'))
          ) {
            const randomNum = Math.floor(Math.random() * 10000);
            this.suggestedUsername = `${this.username}${randomNum}`;
          }
          this.cdr.detectChanges();
        },
      });
  }
}
