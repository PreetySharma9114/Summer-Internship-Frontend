import { Campaign } from './campaign.interface';
import { ApplicationStatus } from '../enums/application-status.enum';

export interface Application {
  _id: string;

  influencerId:
    | string
    | {
        _id: string;
        fullName?: string;
      };

  campaignId: Campaign | null;

  status: ApplicationStatus;
}
