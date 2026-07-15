import { InfluencerNiche } from '../enums/influencer-niche.enum';

export interface InfluencerProfile {
  _id?: string;
  userId?: string;
  fullName: string;
  username: string;
  bio: string;
  niches: InfluencerNiche[];
  instagramUsername?: string;
  youtubeUsername?: string;
  instagramFollowers: number;
  profileImage?: string;
}