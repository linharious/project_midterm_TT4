import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  errorMsg = '';
  email = '';
  password = '';

  constructor(
    private readonly router: Router,
    private readonly auth: Auth,
  ) {}

  submit() {
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        console.log(res);
        this.errorMsg = '';
        this.auth.setToken(res.access_token);
        this.router.navigate(['/jobs']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
