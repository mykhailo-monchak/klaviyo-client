/* eslint @typescript-eslint/no-unused-vars: 0 */

import { KlaviyoClient } from '../src/klaviyo.client';
import { KlaviyoApi } from '../src/klaviyo.api';
import * as dotenv from 'dotenv';

async function test() {
  dotenv.config();
  const email = 'test@gmail.com';

  const client = new KlaviyoClient(process.env.TEST_TOKEN);
  const identified = await client.identify({ $email: email });
  const tracked = await client.track('test', { $email: email }, { test: 'test' });

  const api = new KlaviyoApi(process.env.TEST_API_KEY, process.env.TEST_TOKEN);
  const groupProfiles = await api.Lists.getGroupProfiles(process.env.TEST_GROUP_ID);
  const profile = await api.Profiles.getProfile(process.env.TEST_PROFILE_ID);
  const events = await api.Profiles.getProfileEvents(process.env.TEST_PROFILE_ID);

  console.log('tested');
}

test();
