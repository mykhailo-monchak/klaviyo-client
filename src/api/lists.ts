import { KlaviyoError, KlaviyoList, KlaviyoListDetails, KlaviyoListIdentifier, KlaviyoProfileIdentifier } from '..';
import { waitForRetry } from '../utils/wait-for-retry';
import fetch from 'cross-fetch';

type GroupMembersResponse = {
  marker: number;
  records: KlaviyoProfileIdentifier[];
};

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

  // See https://www.klaviyo.com/docs/api/v2/lists#post-lists for details
  public async createList(name: string): Promise<KlaviyoListIdentifier> {
    const url = 'https://a.klaviyo.com/api/v2/lists';

    const res: Response = await fetch(url, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ api_key: this.apiKey, list_name: name }),
    });

    if (res.ok) {
      const data = (await res.json()) as KlaviyoListIdentifier;
      return data;
    } else if (res.status === 429) {
      await waitForRetry(res);
      return await this.createList(name);
    } else {
      throw new KlaviyoError(res);
    }
  }

  // See https://www.klaviyo.com/docs/api/v2/lists#get-lists for details
  public async getLists(): Promise<KlaviyoList[]> {
    const url = `https://a.klaviyo.com/api/v2/lists?api_key=${encodeURI(this.apiKey)}`;

    const res: Response = await fetch(url);

    if (res.ok) {
      const data = (await res.json()) as KlaviyoList[];
      return data;
    } else if (res.status === 404) {
      return [];
    } else if (res.status === 429) {
      await waitForRetry(res);
      return await this.getLists();
    } else {
      throw new KlaviyoError(res);
    }
  }

  // See https://www.klaviyo.com/docs/api/v2/lists#get-list for details
  public async getListDetails(id: string): Promise<KlaviyoListDetails> {
    const url = `https://a.klaviyo.com/api/v2/list/${id}?api_key=${encodeURI(this.apiKey)}`;

    const res: Response = await fetch(url);

    if (res.ok) {
      const data = (await res.json()) as KlaviyoListDetails;
      return data;
    } else if (res.status === 404) {
      return null;
    } else if (res.status === 429) {
      await waitForRetry(res);
      return await this.getListDetails(id);
    } else {
      throw new KlaviyoError(res);
    }
  }

  // See https://www.klaviyo.com/docs/api/v2/lists#put-list for details
  public async updateList(id: string, name: string): Promise<void> {
    const url = `https://a.klaviyo.com/api/v2/list/${id}`;

    const res: Response = await fetch(url, {
      method: 'put',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ api_key: this.apiKey, list_name: name }),
    });

    if (res.ok) {
      return;
    } else if (res.status === 429) {
      await waitForRetry(res);
      return await this.updateList(id, name);
    } else {
      throw new KlaviyoError(res);
    }
  }

  // See https://www.klaviyo.com/docs/api/v2/lists#delete-list for details
  public async deleteList(id: string): Promise<void> {
    const url = `https://a.klaviyo.com/api/v2/list/${id}`;

    const res: Response = await fetch(url, {
      method: 'delete',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ api_key: this.apiKey }),
    });

    if (res.ok) {
      return;
    } else if (res.status === 429) {
      await waitForRetry(res);
      return await this.deleteList(id);
    } else {
      throw new KlaviyoError(res);
    }
  }
}
