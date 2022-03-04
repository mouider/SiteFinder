import 'dotenv/config';
import { RedisKeyGenerator } from '../../../src/repositories/impl/redis/redisKeyGenerator'
import config from 'config';
const testSuiteName = 'redis_key_generator';
const expectedKeyPrefix = config.get('dataStores.redis.keyPrefix');
test(`${testSuiteName}: getKey`, async () => {
  expect(await RedisKeyGenerator.getKey('test')).toBe(`${expectedKeyPrefix}:test`);
});
test(`${testSuiteName}: getSiteHashId`, async () => {
  expect(await RedisKeyGenerator.getSiteHashKey(999)).toBe(`${expectedKeyPrefix}:sites:info:999`);
});
test(`${testSuiteName}: getSiteIDsKey`, async () => {
  expect(await RedisKeyGenerator.getSiteIDsKey()).toBe(`${expectedKeyPrefix}:sites:ids`);
});
test(`${testSuiteName}: getSiteGeoKey`, async () => {
  expect(await RedisKeyGenerator.getSiteGeoKey()).toBe(`${expectedKeyPrefix}:sites:geo`);
});
test(`${testSuiteName}: setPrefix`, async () => {
  await RedisKeyGenerator.setPrefix('testKeyPrefix')
  expect(await RedisKeyGenerator.getKey('test')).toBe('testKeyPrefix:test');
});