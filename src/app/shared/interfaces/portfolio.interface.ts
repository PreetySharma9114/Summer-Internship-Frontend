export type MediaType = 'IMAGE' | 'VIDEO';

export type Platform = 'INSTAGRAM' | 'YOUTUBE' | 'FACEBOOK' | 'LINKEDIN' | 'TWITTER' | 'OTHER';

export interface Portfolio {
  _id: string;

  profileId: string;

  title: string;

  description: string;

  mediaUrl: string;

  mediaFullUrl: string;

  thumbnailUrl: string;

  thumbnailFullUrl: string;

  mediaType: MediaType;

  platform: Platform;

  hashtags: string[];

  createdAt: string;

  updatedAt: string;
}
