import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface PlatformStats {
  total_users: number;
  active_jobs: number;
  total_value_moved: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  private http = inject(HttpClient);
  
  getPlatformStats(): Observable<PlatformStats> {
    return this.http.get<PlatformStats>(`${environment.apiUrl}/platform/stats`).pipe(
      catchError(error => {
        return throwError(() => new Error('Failed to fetch platform statistics.'));
      })
    );
  }
}
