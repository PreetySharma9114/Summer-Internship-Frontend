import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  IonContent,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonChip,
} from '@ionic/angular/standalone';

import { AuthService } from '../../../../core/services/auth.service';

import { User } from '../../../../shared/interfaces/user.interface';

import { UserRole } from '../../../../shared/enums/user-role.enum';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',

  imports: [
    CommonModule,
    IonContent,
    IonSpinner,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonChip,
  ],
})
export class HomePage implements OnInit {
  private authService = inject(AuthService);

  private router = inject(Router);

  private destroyRef = inject(DestroyRef);

  user: User | null = null;

  loading = true;

  readonly userRole = UserRole;

  ngOnInit(): void {
    this.listenToUserState();
  }

  private listenToUserState(): void {
    this.authService.currentUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user) => {
      this.user = user;

      this.loading = false;
    });
  }

  goToCampaigns(): void {
    this.router.navigate(['/campaign-list']);
  }

  goToMyApplications(): void {
    this.router.navigate(['/my-applications']);
  }

  goToCreateCampaign(): void {
    this.router.navigate(['/create-campaign']);
  }

  goToMyCampaigns(): void {
    this.router.navigate(['/my-campaigns']);
  }

  logout(): void {
    this.authService.logout();
  }
}
