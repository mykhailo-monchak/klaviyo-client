/* eslint @typescript-eslint/no-unused-vars: 0 */

import { KlaviyoClient } from '../src/klaviyo.client';
import * as dotenv from 'dotenv';

async function test() {
  dotenv.config();

  const client = new KlaviyoClient(process.env.TEST_API_KEY, process.env.TEST_TOKEN);

  const groupProfiles = await client.getGroupProfiles(process.env.TEST_GROUP_ID);
  const profile = await client.getProfile(process.env.TEST_PROFILE_ID);
  const events = await client.getProfileEvents(process.env.TEST_PROFILE_ID);
  const identified = await client.identify({ $id: process.env.TEST_PROFILE_ID });
  const tracked = await client.track('test', { $id: process.env.TEST_PROFILE_ID }, { test: 'test' });

  console.log('tested');
}

test();
