import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Portfolio } from '../../shared/interfaces/portfolio.interface';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/portfolio`;

  private uploadUrl = `${environment.apiUrl}/upload`;

  private portfolioSubject = new BehaviorSubject<Portfolio[]>([]);

  portfolio$ = this.portfolioSubject.asObservable();

  uploadPortfolio(file: File): Observable<{
    success: boolean;
    message: string;
    data: {
      mediaUrl: string;
      thumbnailUrl: string;
    };
  }> {
    const formData = new FormData();

    formData.append('portfolio', file);

    return this.http.post<{
      success: boolean;
      message: string;
      data: {
        mediaUrl: string;
        thumbnailUrl: string;
      };
    }>(`${this.uploadUrl}/portfolio`, formData);
  }

  createPortfolio(data: any): Observable<{
    success: boolean;
    message: string;
    data: Portfolio;
  }> {
    return this.http.post<{
      success: boolean;
      message: string;
      data: Portfolio;
    }>(this.apiUrl, data);
  }

  getMyPortfolio(): Observable<{
    success: boolean;
    message: string;
    data: Portfolio[];
  }> {
    return this.http
      .get<{
        success: boolean;
        message: string;
        data: Portfolio[];
      }>(`${this.apiUrl}/my`)
      .pipe(
        tap((response) => {
          this.portfolioSubject.next(response.data);
        }),
      );
  }

  getPortfolioByProfile(profileId: string): Observable<{
    success: boolean;
    message: string;
    data: Portfolio[];
  }> {
    return this.http.get<{
      success: boolean;
      message: string;
      data: Portfolio[];
    }>(`${this.apiUrl}/profile/${profileId}`);
  }

  updatePortfolio(
    id: string,
    data: any,
  ): Observable<{
    success: boolean;
    message: string;
    data: Portfolio;
  }> {
    return this.http.patch<{
      success: boolean;
      message: string;
      data: Portfolio;
    }>(`${this.apiUrl}/${id}`, data);
  }

  deletePortfolio(id: string): Observable<{
    success: boolean;
    message: string;
  }> {
    return this.http.delete<{
      success: boolean;
      message: string;
    }>(`${this.apiUrl}/${id}`);
  }
}