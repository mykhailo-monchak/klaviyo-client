export class KlaviyoError<T> extends Error {
  constructor(public readonly response: Response) {
    super(`Klaviyo API responded: ${response.statusText}`);
  }
}
