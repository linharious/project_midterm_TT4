import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  skills = [];

  errorMsg = '';
  constructor(
    private readonly auth: Auth,
    private readonly router: Router,
  ) {}

  submit() {
    this.auth
      .register(this.name, this.username, this.email, this.password, this.bio, this.skills)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.errorMsg = err.error.error;
        },
      });
  }
}

// name • username • email • password • bio • skills (array)
