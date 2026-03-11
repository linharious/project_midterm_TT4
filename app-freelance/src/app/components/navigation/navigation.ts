import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auth, User } from '../../services/auth';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class Navigation implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isLoggedIn = false;
  private sub?: Subscription;

  constructor(
    private readonly auth: Auth,
    private readonly router: Router,
  ) {
    this.currentUser = this.auth.getCurrentUser();
  }

  logout() {
    this.auth.clearToken();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.updateAuthState();

    this.sub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.updateAuthState());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  updateAuthState() {
    this.currentUser = this.auth.getCurrentUser();
    this.isLoggedIn = !!this.auth.getToken();
  }
}
