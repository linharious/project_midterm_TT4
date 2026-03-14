import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JobService } from '../../../services/job.service';
import { Job, JobSearchFilters } from '../../../models/job.model';

@Component({
  selector: 'app-job-search',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './job-search.html',
  styleUrl: './job-search.scss',
})
export class JobSearch implements OnInit {
  private jobService = inject(JobService);
  private cdr = inject(ChangeDetectorRef);

  jobs: Job[] = [];
  isLoading = false;
  errorMessage = '';

  filters: JobSearchFilters = {
    status: '',
    category: '',
    min_budget: 0
  };

  ngOnInit(): void {
    this.searchJobs();
  }

  searchJobs(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const cleanFilters: JobSearchFilters = {};
    if (this.filters.status) cleanFilters.status = this.filters.status;
    if (this.filters.category && this.filters.category.trim() !== '') {
      cleanFilters.category = this.filters.category;
    }
    if (this.filters.min_budget) {
      cleanFilters.min_budget = Number(this.filters.min_budget);
    }

    this.jobService.searchJobs(cleanFilters).subscribe({
      next: (results) => {
        this.jobs = results;
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

  resetFilters(): void {
    this.filters = { status: '', category: '', min_budget: 0 };
    this.searchJobs();
  }
}
