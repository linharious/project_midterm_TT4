import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProposalService } from '../../../services/proposal.service';
import { Proposal } from '../../../models/proposal.model';

@Component({
  selector: 'app-proposal-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './proposal-list.html',
  styleUrl: './proposal-list.scss'
})
export class ProposalListComponent implements OnInit {
  @Input() jobId!: string;
  @Output() proposalAccepted = new EventEmitter<void>();

  private proposalService = inject(ProposalService);
  private cdr = inject(ChangeDetectorRef);

  proposals: Proposal[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit() {
    this.fetchProposals();
  }

  fetchProposals(): void {
    this.isLoading = true;
    this.proposalService.getJobProposals(this.jobId).subscribe({
      next: (data) => {
        this.proposals = data;
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

  acceptProposal(proposalId: string): void {
    if(confirm('Are you sure you want to accept this proposal? This will assign the freelancer to your project and mark the job as "In Progress".')) {
      this.proposalService.acceptProposal(proposalId).subscribe({
        next: () => {
          this.fetchProposals();
          this.proposalAccepted.emit();
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
