# Klaviyo API client for Node.js and browser

This is a Klaviyo API client for Node.js and browser written in Typescript.

## Installation

```shell
npm i klaviyo-client
```

or

```shell
yarn add klaviyo-client
```

## Simple Example

As demonstrated by this example, you can:

- identify profiles
- track their events
- get profiles from list and segments
- get complete profile data
- get a list of profile events

And also you can define strongly-typed profile properties.

```typescript
import { KlaviyoClient } from 'klaviyo-client';

...

type CustomKlaviyoProfileProperties = {
  status: 'happy' | 'excited';
};

...

await klaviyo.identify<CustomKlaviyoProfileProperties>({ $email: 'test@example.com', status: 'happy' });

await klaviyo.track<CustomKlaviyoProfileProperties>(
    'smiled',
    { $email: 'test@example.com', status: 'excited' },
    { reason: 'because of you' },
);

const persons = await klaviyo.getGroupProfiles('XV77mQ');
console.log(`There are ${persons.length} happy persons.`);

for (const p of persons) {
    const person = await klaviyo.getProfile<CustomKlaviyoProfileProperties>(p.id);
    console.log(`${person.$first_name} is ${person.status}.`);

    const events = await klaviyo.getProfileEvents(p.id);
    console.log(`${person.$first_name} has smiled ${events.length} times.`);
}
```

## Configuration

You can get **API key** and **token** in your Klaviyo account <a href="https://www.klaviyo.com/account#api-keys-tab/" target="_blank">here</a>.

_Token is also known as Site ID or public API key._

Please read <a href="https://www.klaviyo.com/docs/http-api/" target="_blank">Klaviyo API documentation</a>.

## Need Help or Feature?

Drop me an email to [Mikhail Monchak](mailto:mikhail.monchak.work@gmail.com)
