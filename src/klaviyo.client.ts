import { KlaviyoError, KlaviyoEventProperties, KlaviyoTrackProfile } from '.';
import { encode } from 'js-base64';
import { waitForRetry } from './utils/wait-for-retry';
import fetch from 'cross-fetch';

export class KlaviyoClient {
  constructor(private readonly token: string) {}

  // See https://www.klaviyo.com/docs/http-api#identify for details
  public async identify(profile: Partial<KlaviyoTrackProfile>): Promise<boolean> {
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
      await waitForRetry(res);
      return await this.identify(profile);
    } else {
      throw new KlaviyoError(res);
    }
  }

  // See https://www.klaviyo.com/docs/http-api#track for details
  public async track(
    eventName: string,
    profile: Partial<KlaviyoTrackProfile>,
    event: Partial<KlaviyoEventProperties>,
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
      await waitForRetry(res);
      return await this.track(eventName, profile, event);
    } else {
      throw new KlaviyoError(res);
    }
  }
}
