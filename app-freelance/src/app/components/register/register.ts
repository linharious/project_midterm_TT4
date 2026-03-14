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
  skillsStr = '';

  errorMsg = '';
  private cdr = inject(ChangeDetectorRef);
  constructor(
    private readonly auth: Auth,
    private readonly router: Router,
  ) {}

  submit() {
    this.errorMsg = '';

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
          console.error(err);
          if (err.error && err.error.message) {
            this.errorMsg = err.error.message;
          } else if (err.error && err.error.error) {
            this.errorMsg = err.error.error;
          } else {
            this.errorMsg = 'Failed to register. Please try again.';
          }
          this.cdr.detectChanges();
        },
      });
  }
}
