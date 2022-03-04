import { AsyncRedisMock } from "../unit/async_redis_mock";
const client = new AsyncRedisMock();
const testSuiteName = 'basic_tests';
const testKeyName = `${testSuiteName}`;
beforeAll(async () => {
  jest.setTimeout(15000);
});
beforeEach(async () => {
  await client.del(testKeyName);
});

afterEach(async () => {
  await client.del(testKeyName);
});
afterAll(async () => {
  await client.quit();
});
test(`${testSuiteName}: Test Redis string`, async () => {
  await client.set(testKeyName, 'hello');
  const value = await client.get(testKeyName);
  expect(typeof (value)).toBe('string');
  expect(value).toBe('hello');
});
//Test Redis List
test(`${testSuiteName}: Test Redis list`, async () => {
  await client.rPush(testKeyName, ['one', 'two', 'three']);
  const value = await client.lRange(testKeyName, 0, 3);
  expect(typeof (value)).toBe('object');
  expect(Array.isArray(value)).toBe(true);
  expect(value.length).toBe(3);
  expect(value).toEqual(['one', 'two', 'three']);
});
//Test Redis set
test(`${testSuiteName}: Test Redis set`, async () => {
  await client.sAdd(testKeyName, ['one', 'two', 'two', 'three']);
  const value = await client.sMembers(testKeyName);
  expect(typeof (value)).toBe('object');
  expect(Array.isArray(value)).toBe(true);
  expect(value.length).toBe(3);
});
test(`${testSuiteName}: Test Redis hash`, async () => {
  await client.hSet(testKeyName, {
    name: 'John Doe',
    age: 42,
  });
  const value = await client.hGetAll(testKeyName);
  expect(typeof (value)).toBe('object');
  expect(Array.isArray(value)).toBe(false);
  expect(typeof (value.age)).toBe('string');
  expect(parseInt(value.age, 10)).toBe(42);
  expect(value).toEqual({
    name: 'John Doe',
    age: '42',
  });
});
test(`${testSuiteName}: Test Redis float`, async () => {
  await client.set(testKeyName, 22.5);

  const value = await client.incrByFloat(testKeyName, 1);
  expect(typeof (value)).toBe('string');
  expect(value).toBe('23.5');
  expect(parseFloat(value)).toBeCloseTo(23.5);
});
test(`${testSuiteName}: Test Redis integer`, async () => {
  await client.set(testKeyName, 22);
  let value = await client.get(testKeyName);
  expect(typeof (value)).toBe('string');
  expect(value).toBe('22');
  value = await client.incrBy(testKeyName, 1);
  expect(typeof (value)).toBe('number');
  expect(value).toBe(23);
  expect(parseInt(value, 10)).toBe(23);
});