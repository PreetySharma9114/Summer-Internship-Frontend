import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  IonContent,
  IonChip,
  IonSpinner,
} from '@ionic/angular/standalone';

import { ProfileService } from '../../../../core/services/profile.service';

import { InfluencerProfile } from '../../interfaces/influencer-profile.interface';
import { Portfolio } from '../../../../shared/interfaces/portfolio.interface';

@Component({
  selector: 'app-influencer-details',
  standalone: true,
  templateUrl: './influencer-details.page.html',
  imports: [
    CommonModule,
    IonContent,
    IonChip,
    IonSpinner,
  ],
})
export class InfluencerDetailsPage implements OnInit {
  private profileService = inject(ProfileService);

  private route = inject(ActivatedRoute);

  private destroyRef = inject(DestroyRef);

  loading = true;

  profile?: InfluencerProfile;

  portfolio: Portfolio[] = [];

  ngOnInit(): void {
    const profileId = this.route.snapshot.paramMap.get('profileId');

    if (!profileId) {
      this.loading = false;
      return;
    }

    this.loadProfile(profileId);

    this.loadPortfolio(profileId);
  }

  private loadProfile(profileId: string): void {
    this.profileService
      .getInfluencerProfile(profileId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => {
          this.profile = profile;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  private loadPortfolio(profileId: string): void {
    this.profileService
      .getInfluencerPortfolio(profileId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((portfolio) => {
        this.portfolio = portfolio;
      });
  }
}