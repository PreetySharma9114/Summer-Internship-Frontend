import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Application } from '../../shared/interfaces/application.interface';
import { ApplicationStatus } from '../../shared/enums/application-status.enum';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/applications`;

  private campaignApplicationsSubject = new BehaviorSubject<Application[]>([]);

  campaignApplications$ =
    this.campaignApplicationsSubject.asObservable();

  private myApplicationsSubject = new BehaviorSubject<Application[]>([]);

  myApplications$ = this.myApplicationsSubject.asObservable();

  applyToCampaign(
    campaignId: string,
  ): Observable<{
    success: boolean;
    message: string;
  }> {
    return this.http.post<{
      success: boolean;
      message: string;
    }>(`${this.apiUrl}/campaigns/${campaignId}/apply`, {});
  }

  getMyApplications(): Observable<{
    success: boolean;
    message: string;
    data: Application[];
  }> {
    return this.http
      .get<{
        success: boolean;
        message: string;
        data: Application[];
      }>(`${this.apiUrl}/my`)
      .pipe(
        tap((response) => {
          this.myApplicationsSubject.next(response.data);
        }),
      );
  }

  getCampaignApplications(
    campaignId: string,
  ): Observable<{
    success: boolean;
    message: string;
    data: Application[];
  }> {
    return this.http
      .get<{
        success: boolean;
        message: string;
        data: Application[];
      }>(`${this.apiUrl}/campaigns/${campaignId}/applications`)
      .pipe(
        tap((response) => {
          this.campaignApplicationsSubject.next(response.data);
        }),
      );
  }

  updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
  ): Observable<{
    success: boolean;
    message: string;
  }> {
    return this.http.patch<{
      success: boolean;
      message: string;
    }>(`${this.apiUrl}/${applicationId}/status`, {
      status,
    });
  }
}