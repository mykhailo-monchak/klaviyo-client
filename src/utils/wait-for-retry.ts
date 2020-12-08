export async function waitForRetry(r: Response): Promise<void> {
  const time = 1000 * r.headers['retry-after'] || 3000;
  await new Promise((resolve) => setTimeout(resolve, time));
}
