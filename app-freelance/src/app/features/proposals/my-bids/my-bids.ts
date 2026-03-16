import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProposalService } from '../../../services/proposal.service';
import { Proposal } from '../../../models/proposal.model';

@Component({
  selector: 'app-my-bids',
  imports: [CommonModule, RouterModule],
  templateUrl: './my-bids.html',
  styleUrl: './my-bids.scss',
})
export class MyBidsComponent implements OnInit {
  private proposalService = inject(ProposalService);
  private cdr = inject(ChangeDetectorRef);

  myBids: Proposal[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.fetchMyBids();
  }

  fetchMyBids(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.proposalService.getMyBids().subscribe({
      next: (bids) => {
        this.myBids = bids;
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

  retractBid(proposalId: string): void {
    if (confirm('Are you sure you want to retract this proposal?')) {
      this.proposalService.deleteProposal(proposalId).subscribe({
        next: () => {
          this.fetchMyBids();
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
