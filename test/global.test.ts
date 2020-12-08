/* eslint @typescript-eslint/no-unused-vars: 0 */

import { KlaviyoClient } from '../src/klaviyo.client';
import { KlaviyoApi } from '../src/klaviyo.api';
import * as dotenv from 'dotenv';

async function test() {
  dotenv.config();

  const email = 'test@gmail.com';

  type CustomKlaviyoProfile = {
    status: 'happy' | 'excited';
  };

  type CustomKlaviyoEvent = {
    reason: string;
  };

  const client = new KlaviyoClient(process.env.TEST_TOKEN);
  const identified = await client.identify({ $email: email, status: 'happy' });
  const identifiedCustom = await client.identify<CustomKlaviyoProfile>({ $email: email, status: 'happy' });

  const tracked = await client.track('test', { $email: email, status: 'excited' }, { reason: 'because of you' });
  const trackedCustom = await client.track<CustomKlaviyoProfile, CustomKlaviyoEvent>(
    'test',
    { $email: email, status: 'excited' },
    { reason: 'because of you' },
  );

  const api = new KlaviyoApi(process.env.TEST_API_KEY, process.env.TEST_TOKEN);
  const groupProfiles = await api.Lists.getGroupProfiles(process.env.TEST_GROUP_ID);

  const profile = await api.Profiles.getProfile(process.env.TEST_PROFILE_ID);
  const profileCustom = await api.Profiles.getProfile<CustomKlaviyoProfile>(process.env.TEST_PROFILE_ID);

  const events = await api.Profiles.getProfileEvents(process.env.TEST_PROFILE_ID);
  const eventsCustom = await api.Profiles.getProfileEvents<CustomKlaviyoProfile, CustomKlaviyoEvent>(
    process.env.TEST_PROFILE_ID,
  );

  console.log('tested');
}

test();
