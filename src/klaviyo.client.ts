import { encode } from 'js-base64';
import fetch from 'cross-fetch';
import { KlaviyoError, KlaviyoProfileIdentifier, KlaviyoProfile, KlaviyoEvent } from '.';

export class KlaviyoClient {
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
      await this.waitForRetry(res);
      const nextProfiles = await this.getGroupProfiles(groupId, marker);
      profiles.push(...nextProfiles);
      return profiles;
    } else {
      throw new KlaviyoError(res);
    }

    return profiles;
  }

  // See https://www.klaviyo.com/docs/api/people#person for details
  public async getProfile<T extends Record<string, unknown>>(id: string): Promise<KlaviyoProfile<T>> {
    const url = `https://a.klaviyo.com/api/v1/person/${id}?api_key=${encodeURI(this.apiKey)}`;

    const res: Response = await fetch(url);

    if (res.ok) {
      return (await res.json()) as KlaviyoProfile<T>;
    } else if (res.status === 404) {
      return null;
    } else if (res.status === 429) {
      await this.waitForRetry(res);
      return await this.getProfile(id);
    } else {
      throw new KlaviyoError(res);
    }
  }

  // See https://www.klaviyo.com/docs/api/people#metrics-timeline for details
  public async getProfileEvents<T extends Record<string, unknown>>(
    id: string,
    since: string = null,
  ): Promise<KlaviyoEvent<T>[]> {
    const events: KlaviyoEvent<T>[] = [];
    let url = `https://a.klaviyo.com/api/v1/person/${id}/metrics/timeline?api_key=${encodeURI(this.apiKey)}`;

    if (since != null) {
      url = `${url}&since=${encodeURI(since)}`;
    }

    const res: Response = await fetch(url);

    if (res.ok) {
      const data = (await res.json()) as PersonEventsResponse<T>;
      events.push(...data.data);

      if (data.next != null) {
        const nextEvents = await this.getProfileEvents<T>(id, data.next);
        events.push(...nextEvents);
      }
    } else if (res.status === 404) {
      return events;
    } else if (res.status === 429) {
      await this.waitForRetry(res);
      const nextEvents = await this.getProfileEvents<T>(id, since);
      events.push(...nextEvents);
      return events;
    } else {
      throw new KlaviyoError(res);
    }

    return events;
  }

  // See https://www.klaviyo.com/docs/http-api#identify for details
  public async identify<T extends Record<string, unknown>>(profile: Partial<KlaviyoProfile<T>>): Promise<boolean> {
    const params = {
      token: this.token,
      properties: profile,
    };

    const payload = encode(JSON.stringify(params));

    const url = `https://a.klaviyo.com/api/identify?data=${payload}`;

    const res: Response = await fetch(url);

    if (res.ok) {
      return (await res.json()) as boolean;
    } else if (res.status === 429) {
      await this.waitForRetry(res);
      return await this.identify(profile);
    } else {
      throw new KlaviyoError(res);
    }
  }

  // See https://www.klaviyo.com/docs/http-api#track for details
  public async track<T extends Record<string, unknown>>(
    eventName: string,
    profile: Partial<KlaviyoProfile<T>>,
    event: Record<string, unknown>,
  ): Promise<boolean> {
    const params = {
      token: this.token,
      event: eventName,
      customer_properties: profile,
      properties: event,
    };

    const payload = encode(JSON.stringify(params));

    const url = `https://a.klaviyo.com/api/track?data=${payload}`;

    const res: Response = await fetch(url);

    if (res.ok) {
      return (await res.json()) as boolean;
    } else if (res.status === 429) {
      await this.waitForRetry(res);
      return await this.identify(profile);
    } else {
      throw new KlaviyoError(res);
    }
  }

  private async waitForRetry(r: Response) {
    const time = 1000 * r.headers['retry-after'] || 3000;
    await new Promise((resolve) => setTimeout(resolve, time));
  }
}

interface PersonEventsResponse<T extends Record<string, unknown>> {
  count: number;
  object: string;
  data: KlaviyoEvent<T>[];
  next: string;
}

interface GroupMembersResponse {
  marker: number;
  records: KlaviyoProfileIdentifier[];
}
