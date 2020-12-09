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

## Usage

The package contains two separate classes:

- `KlaviyoClient` to identify profiles and track events. Klaviyo Token is needed to use it
- `KlaviyoApi` to work with Klaviyo API. Klaviyo Token and API key are needed to use it. Currently it supports following operations:
  - Lists - get profiles from list and segments
  - Lists - create a list
  - Profiles - get complete profile data
  - Profiles - create or update profile data
  - Profiles - get a list of profile events
  - Profiles - get a list of profile events by metric ID

The package supports providing generic event or profile properties types in order to work in well-known types manner.

## Configuration

You can get **API key** and **token** in your Klaviyo account <a href="https://www.klaviyo.com/account#api-keys-tab/" target="_blank">here</a>.

_Token is also known as Site ID or public API key._

Please read <a href="https://www.klaviyo.com/docs/http-api/" target="_blank">Klaviyo API documentation</a>.

## Need Help or Feature?

Drop me an email to [Mikhail Monchak](mailto:mikhail.monchak.work@gmail.com)
