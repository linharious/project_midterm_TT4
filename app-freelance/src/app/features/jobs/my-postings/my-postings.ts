import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from '../../../services/job.service';
import { Job } from '../../../models/job.model';

@Component({
  selector: 'app-my-postings',
  imports: [CommonModule, RouterModule],
  templateUrl: './my-postings.html',
  styleUrl: './my-postings.scss',
})
export class MyPostings implements OnInit {
  private jobService = inject(JobService);
  private cdr = inject(ChangeDetectorRef);

  myJobs: Job[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.fetchMyPostings();
  }

  fetchMyPostings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.jobService.getMyPostings().subscribe({
      next: (jobs) => {
        this.myJobs = jobs;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}

