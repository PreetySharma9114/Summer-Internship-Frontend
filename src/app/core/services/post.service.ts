import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  CaptionResult,
  RefineCaption,
  SubmitCampaignPost,
} from 'src/app/shared/interfaces/post.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/post`;

  generateCaption(file: File, userText: string | null) {
    const formData = new FormData();

    formData.append('post', file);

    if (userText) formData.append('userText', userText);

    return this.http.post<{ success: boolean; data: CaptionResult; message: string }>(
      `${this.apiUrl}/caption`,
      formData,
    );
  }

  refineCaption(payload: RefineCaption) {
    return this.http.patch<{ message: string; caption: string }>(`${this.apiUrl}/caption`, payload);
  }

  submitPost(data: SubmitCampaignPost) {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}`, data);
  }
}
