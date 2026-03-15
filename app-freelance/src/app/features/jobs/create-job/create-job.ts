import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../../../services/job.service';

@Component({
  selector: 'app-create-job',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-job.html',
  styleUrl: './create-job.scss',
})
export class CreateJob {
  private fb = inject(FormBuilder);
  private jobService = inject(JobService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  jobForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    budget: [null as number | null, [Validators.required, Validators.min(5)]],
    category: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const newJob = {
      title: this.jobForm.value.title!,
      description: this.jobForm.value.description!,
      budget: Number(this.jobForm.value.budget),
      category: this.jobForm.value.category!
    };

    this.jobService.createJob(newJob).subscribe({
      next: (createdJob) => {
        this.isSubmitting = false;
        this.successMessage = 'Job successfully posted!';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/jobs/my-postings']);
        }, 1500);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.message;
        this.cdr.detectChanges();
      }
    });
  }
}

