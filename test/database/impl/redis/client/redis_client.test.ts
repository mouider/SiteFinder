import * as redis_client from '../../../../../src/repositories/impl/redis/redis_client';

const testSuiteName = 'redis_client';
test(`${testSuiteName}:reconnectStrategy`, () => {
  const client = redis_client.getClient({
    host: 'redis',
    port: 6379,
    max_retry: 4,
    connectTimeout: 5000,
    period: 1000
  });
  expect(client.options.socket.reconnectStrategy(3)).toBe(3000);
  expect(client.options.socket.reconnectStrategy(5)).toEqual(new Error('Retry attempts exhausted.'));
});
test(`${testSuiteName}:default`, async () => {
  const client = redis_client.getClient();
  expect(client).toBeTruthy();
});








