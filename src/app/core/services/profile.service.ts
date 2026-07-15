import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Portfolio } from '../../shared/interfaces/portfolio.interface';
import { map } from 'rxjs';
import { InfluencerProfile } from '../../features/profile/interfaces/influencer-profile.interface';
import { switchMap, tap } from 'rxjs';
import { UploadService } from './upload.service';
import { BrandProfile } from '../../features/profile/interfaces/brand-profile.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/profile`;

  private influencerProfileSubject = new BehaviorSubject<InfluencerProfile | null>(null);

  private brandProfileSubject = new BehaviorSubject<BrandProfile | null>(null);
  private uploadService = inject(UploadService);
  influencerProfile$ = this.influencerProfileSubject.asObservable();

  brandProfile$ = this.brandProfileSubject.asObservable();

  createBrandProfile(profile: BrandProfile, logo?: File): Observable<BrandProfile> {
    if (!logo) {
      return this.http.post<BrandProfile>(`${this.apiUrl}/brand`, profile).pipe(
        tap((response) => {
          this.brandProfileSubject.next(response);
        }),
      );
    }

    return this.uploadService.uploadFile(logo).pipe(
      switchMap((uploadResponse) =>
        this.http.post<BrandProfile>(`${this.apiUrl}/brand`, {
          ...profile,
          logo: uploadResponse.url,
        }),
      ),
      tap((response) => {
        this.brandProfileSubject.next(response);
      }),
    );
  }

  createInfluencerProfile(profile: InfluencerProfile, image?: File): Observable<InfluencerProfile> {
    if (!image) {
      return this.http.post<InfluencerProfile>(`${this.apiUrl}/influencer`, profile).pipe(
        tap((response) => {
          this.influencerProfileSubject.next(response);
        }),
      );
    }

    return this.uploadService.uploadFile(image).pipe(
      switchMap((uploadResponse) =>
        this.http.post<InfluencerProfile>(`${this.apiUrl}/influencer`, {
          ...profile,
          profileImage: uploadResponse.url,
        }),
      ),
      tap((response) => {
        this.influencerProfileSubject.next(response);
      }),
    );
  }
  getInfluencerProfile(profileId: string): Observable<InfluencerProfile> {
    return this.http
      .get<{
        success: boolean;
        message: string;
        data: InfluencerProfile;
      }>(`${this.apiUrl}/influencer/${profileId}`)
      .pipe(map((response) => response.data));
  }

  getInfluencerPortfolio(profileId: string): Observable<Portfolio[]> {
    return this.http
      .get<{
        success: boolean;
        message: string;
        data: Portfolio[];
      }>(`${environment.apiUrl}/portfolio/profile/${profileId}`)
      .pipe(map((response) => response.data));
  }
}
