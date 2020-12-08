import { KlaviyoError, KlaviyoProfile, KlaviyoEvent } from '..';
import { waitForRetry } from '../utils/wait-for-retry';
import fetch from 'cross-fetch';

interface PersonEventsResponse {
  count: number;
  object: string;
  data: KlaviyoEvent[];
  next: string;
}

export class ProfilesKlaviyoApi {
  constructor(private readonly apiKey: string, private readonly token: string) {}

  // See https://www.klaviyo.com/docs/api/people#person for details
  public async getProfile(id: string): Promise<KlaviyoProfile> {
    const url = `https://a.klaviyo.com/api/v1/person/${id}?api_key=${encodeURI(this.apiKey)}`;

    const res: Response = await fetch(url);

    if (res.ok) {
      return (await res.json()) as KlaviyoProfile;
    } else if (res.status === 404) {
      return null;
    } else if (res.status === 429) {
      await waitForRetry(res);
      return await this.getProfile(id);
    } else {
      throw new KlaviyoError(res);
    }
  }

  // See https://www.klaviyo.com/docs/api/people#metrics-timeline for details
  public async getProfileEvents(id: string, since: string = null): Promise<KlaviyoEvent[]> {
    const events: KlaviyoEvent[] = [];
    let url = `https://a.klaviyo.com/api/v1/person/${id}/metrics/timeline?api_key=${encodeURI(this.apiKey)}`;

    if (since != null) {
      url = `${url}&since=${encodeURI(since)}`;
    }

    const res: Response = await fetch(url);

    if (res.ok) {
      const data = (await res.json()) as PersonEventsResponse;
      events.push(...data.data);

      if (data.next != null) {
        const nextEvents = await this.getProfileEvents(id, data.next);
        events.push(...nextEvents);
      }
    } else if (res.status === 404) {
      return events;
    } else if (res.status === 429) {
      await waitForRetry(res);
      const nextEvents = await this.getProfileEvents(id, since);
      events.push(...nextEvents);
      return events;
    } else {
      throw new KlaviyoError(res);
    }

    return events;
  }
}
