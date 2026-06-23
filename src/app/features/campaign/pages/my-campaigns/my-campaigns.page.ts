import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { IonContent } from '@ionic/angular/standalone';

import { CampaignService } from '../../../../core/services/campaign.service';

import { Campaign } from '../../../../shared/interfaces/campaign.interface';

import { CampaignCardComponent } from '../../../../shared/components/campaign-card/campaign-card.component';

@Component({
  selector: 'app-my-campaigns',
  standalone: true,
  templateUrl: './my-campaigns.page.html',
  imports: [CommonModule, IonContent,CampaignCardComponent],
})
export class MyCampaignsPage implements OnInit {
  private campaignService = inject(CampaignService);

  private destroyRef = inject(DestroyRef);

  campaigns: Campaign[] = [];

  loading = true;

  ngOnInit(): void {
    this.listenToCampaignState();

    this.loadMyCampaigns();
  }

  private listenToCampaignState(): void {
    this.campaignService.myCampaigns$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((campaigns) => {
        this.campaigns = campaigns;

        this.loading = false;
      });
  }

  private loadMyCampaigns(): void {
    this.loading = true;

    this.campaignService
      .getMyCampaigns()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => {
          this.loading = false;
        },
      });
  }
}
