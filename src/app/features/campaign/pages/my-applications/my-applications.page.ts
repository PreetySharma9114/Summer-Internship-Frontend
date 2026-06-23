import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { IonContent, IonSpinner } from '@ionic/angular/standalone';
import { Application } from '../../../../shared/interfaces/application.interface';
import { ApplicationService } from '../../../../core/services/application.service';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  templateUrl: './my-applications.page.html',
  imports: [CommonModule, IonContent, IonSpinner, TitleCasePipe],
})
export class MyApplicationsPage implements OnInit {
  private applicationService = inject(ApplicationService);

  private destroyRef = inject(DestroyRef);

  applications: Application[] = [];

  loading = true;
  ngOnInit(): void {
    this.listenToMyApplicationsState();

    this.loadMyApplications();
  }
 private listenToMyApplicationsState(): void {
  this.applicationService.myApplications$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((applications) => {
      this.applications = applications;
    });
}
private loadMyApplications(): void {
  this.loading = true;

  this.applicationService
    .getMyApplications()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {
        this.loading = false;
      },

      error: () => {
        this.loading = false;
      },
    });
}
}
