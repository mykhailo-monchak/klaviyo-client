import { ProfilesKlaviyoApi } from './api/profiles';
import { ListsKlaviyoApi } from './api/lists';

export class KlaviyoApi {
  constructor(private readonly apiKey: string, private readonly token: string) {}

  public get Profiles(): ProfilesKlaviyoApi {
    return new ProfilesKlaviyoApi(this.apiKey, this.token);
  }

  public get Lists(): ListsKlaviyoApi {
    return new ListsKlaviyoApi(this.apiKey, this.token);
  }
}
