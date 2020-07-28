export interface KlaviyoProfile {
  $id: string;
  $email: string;
  $first_name: string;
  $last_name: string;
  $phone_number: string;
  $title: string;
  $organization: string;
  $city: string;
  $region: string;
  $country: string;
  $zip: string;
  $image: string;
  $consent: string;
  $timezone: string;
}

export interface KlaviyoProfileIdentifier {
  id: string;
  email: string;
}

export interface KlaviyoEvent {
  event_properties: Record<string, unknown>;
  uuid?: string;
  event_name: string;
  timestamp?: number;
  object?: string;
  datetime?: string;
  person?: KlaviyoProfile;
  statistic_id?: string;
  id?: string;
}
