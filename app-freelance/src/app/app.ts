import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Navigation } from './components/navigation/navigation';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Login, Register, Navigation],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('app-freelance');
}
