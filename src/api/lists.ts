import { KlaviyoError, KlaviyoProfileIdentifier } from '..';
import { waitForRetry } from '../utils/wait-for-retry';
import fetch from 'cross-fetch';

interface GroupMembersResponse {
  marker: number;
  records: KlaviyoProfileIdentifier[];
}

export class ListsKlaviyoApi {
  constructor(private readonly apiKey: string, private readonly token: string) {}

  // See https://www.klaviyo.com/docs/api/v2/lists#get-members-all for details
  public async getGroupProfiles(groupId: string, marker: number = null): Promise<KlaviyoProfileIdentifier[]> {
    const profiles: KlaviyoProfileIdentifier[] = [];
    let url = `https://a.klaviyo.com/api/v2/group/${groupId}/members/all?api_key=${encodeURI(this.apiKey)}`;

    if (marker != null) {
      url = `${url}&marker=${encodeURI('' + marker)}`;
    }

    const res: Response = await fetch(url);

    if (res.ok) {
      const data = (await res.json()) as GroupMembersResponse;
      profiles.push(...data.records);

      if (data.marker != null) {
        const nextProfiles = await this.getGroupProfiles(groupId, data.marker);
        profiles.push(...nextProfiles);
      }
    } else if (res.status === 404) {
      return profiles;
    } else if (res.status === 429) {
      await waitForRetry(res);
      const nextProfiles = await this.getGroupProfiles(groupId, marker);
      profiles.push(...nextProfiles);
      return profiles;
    } else {
      throw new KlaviyoError(res);
    }

    return profiles;
  }
}
