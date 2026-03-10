import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly apiUrl = 'https://stingray-app-wxhhn.ondigitalocean.app';
  constructor(private readonly http: HttpClient) {}
}
