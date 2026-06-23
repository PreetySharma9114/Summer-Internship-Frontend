import { Component, Input, inject } from '@angular/core';
import {
  CurrencyPipe,
  DatePipe,
  TitleCasePipe,
} from '@angular/common';

import {
  IonCard,
  IonChip,
  IonProgressBar,
} from '@ionic/angular/standalone';
import { Campaign } from '../../interfaces/campaign.interface';
import { Router } from '@angular/router';
import { CampaignStatus } from '../../enums/campaign-status.enum';

@Component({
  selector: 'app-campaign-card',
  standalone: true,
  imports: [
    IonCard,
    IonChip,
    IonProgressBar,
    CurrencyPipe,
    DatePipe,
    TitleCasePipe,
  ],
  templateUrl: './campaign-card.component.html',
})
export class CampaignCardComponent {
  private router = inject(Router);
  
  @Input({ required: true })
  campaign!: Campaign;
  protected readonly campaignStatus = CampaignStatus;
  
  viewDetails(): void {
    this.router.navigate(['/campaign-details', this.campaign._id]);
  }
}
