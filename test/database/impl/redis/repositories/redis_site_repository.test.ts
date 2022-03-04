
import { RedisSiteRepository } from '../../../../../src/repositories/impl/redis/redisSiteRepository';
import { RedisKeyGenerator } from '../../../../../src/repositories/impl/redis/redisKeyGenerator'
import { Site } from '../../../../../src/domain/site'
import * as client from '../../../../../src/repositories/impl/redis/redis_client';
const redis = client.getClient()
const redisSiteRepository = new RedisSiteRepository(client);
const testSuiteName = 'site_repo_test';
const testKeyPrefix = `integration:${testSuiteName}`;
RedisKeyGenerator.setPrefix(testKeyPrefix);
beforeAll(async () => {
  jest.setTimeout(1200000);
  await redis.connect();
});
beforeEach(async () => {
  const testKeys = await redis.keys(`${testKeyPrefix}:*`);

  if (testKeys.length > 0) {
    await redis.del(testKeys);
  }
});
afterEach(async () => {
  const testKeys = await redis.keys(`${testKeyPrefix}:*`);

  if (testKeys.length > 0) {
    await redis.del(testKeys);
  }
});
afterAll(() => {
  // Release Redis connection.
  redis.quit();
});
test(`${testSuiteName}: insert without coordinates`, async () => {
  const site = {
    id: 4,
    capacity: 5.5,
    panels: 4,
    address: '910 Pine St.',
    city: 'Oakland',
    countryCode: 'US',
    state: 'CA',
    postalCode: '94577',
  };
  const expectedSiteHash = {
    id: '4',
    capacity: '5.5',
    panels: '4',
    address: '910 Pine St.',
    countryCode: 'US',
    city: 'Oakland',
    state: 'CA',
    postalCode: '94577',
  };
  await redisSiteRepository.insert(new Site(site));
  const siteHashKey = await RedisKeyGenerator.getSiteHashKey(site.id);
  const siteIDsKey = await RedisKeyGenerator.getSiteIDsKey();
  const isMember = await redis.sIsMember(
    siteIDsKey,
    siteHashKey,
  );
  expect(!!isMember).toBe(true);
  const siteFromRedis = await redis.hGetAll(siteHashKey);
  expect(siteFromRedis).toEqual(expectedSiteHash);
});
test(`${testSuiteName}: insert with coordinates`, async () => {
  const site = {
    id: 4,
    capacity: 5.5,
    panels: 4,
    address: '910 Pine St.',
    countryCode: 'US',
    city: 'Oakland',
    state: 'CA',
    postalCode: '94577',
    coordinate: {
      lat: 37.739659,
      lng: -122.255689,
    },
  };
  const expectedSiteHash = {
    id: '4',
    capacity: '5.5',
    panels: '4',
    address: '910 Pine St.',
    city: 'Oakland',
    countryCode: 'US',
    state: 'CA',
    postalCode: '94577',
    lat: '37.739659',
    lng: '-122.255689',
  };
  await redisSiteRepository.insert(new Site(site));
  const siteHashKey = await RedisKeyGenerator.getSiteHashKey(site.id);
  const siteIDsKey = await RedisKeyGenerator.getSiteIDsKey();
  const SiteGeoKey = await RedisKeyGenerator.getSiteGeoKey();
  const isMember = await redis.sIsMember(
    siteIDsKey,
    siteHashKey,
  );
  expect(!!isMember).toBe(true);
  const geopos = await redis.geoPos(SiteGeoKey, site.id.toString());
  const siteFromRedis = await redis.hGetAll(siteHashKey);
  expect(parseFloat(geopos[0].latitude)).toBeCloseTo(site.coordinate.lat);
  expect(parseFloat(geopos[0].longitude)).toBeCloseTo(site.coordinate.lng);
  expect(siteFromRedis).toEqual(expectedSiteHash);
});
test(`${testSuiteName}: findById with existing site`, async () => {
  const site = {
    id: 4,
    capacity: 5.5,
    panels: 4,
    address: '910 Pine St.',
    countryCode: 'US',
    city: 'Oakland',
    state: 'CA',
    postalCode: '94577',
  };
  await redisSiteRepository.insert(new Site(site));
  const siteFromRedis = await redisSiteRepository.findById(site.id);
  expect(siteFromRedis).toEqual(new Site(site));
});
test(`${testSuiteName}: findById with existing site with coordinates`, async () => {
  const site = {
    id: 4,
    capacity: 5.5,
    panels: 4,
    address: '910 Pine St.',
    countryCode: 'US',
    city: 'Oakland',
    state: 'CA',
    postalCode: '94577',
    coordinate: {
      lat: 37.739659,
      lng: -122.255689,
    },
  };

  await redisSiteRepository.insert(new Site(site));
  const siteFromRedis = await redisSiteRepository.findById(site.id);
  expect(siteFromRedis).toEqual(new Site(site));


});
test(`${testSuiteName}: findById with missing site`, async () => {
  const siteFromRedis = await redisSiteRepository.findById(152);
  expect(siteFromRedis).toEqual(null)
});
test(`${testSuiteName}: findAll with multiple sites`, async () => {
  const sites = [{
    id: 1,
    capacity: 4.5,
    panels: 3,
    address: '123 Willow St.',
    city: 'Oakland',
    countryCode: 'US',
    state: 'CA',
    postalCode: '94577',
    coordinate: {
      lat: 37.739659,
      lng: -122.255689,
    },
  }, {
    id: 2,
    capacity: 3.0,
    panels: 2,
    address: '456 Maple St.',
    city: 'Oakland',
    state: 'CA',
    countryCode: 'US',
    postalCode: '94577',
    coordinate: {
      lat: 37.739559,
      lng: -122.256689,
    },
  }, {
    id: 3,
    capacity: 4.0,
    panels: 3,
    address: '789 Oak St.',
    city: 'Oakland',
    countryCode: 'US',
    state: 'CA',
    postalCode: '94577',
    coordinate: {
      lat: 37.739659,
      lng: -122.255689,
    },
  }];
  const expectedsites: Site[] = [];
  for (const site of sites) {
    expectedsites.push(new Site(site));
    await redisSiteRepository.insert(new Site(site));
  }
  const sites_from_redis = await redisSiteRepository.findAll();
  expect(sites_from_redis.length).toEqual(sites.length);
  expect(sites_from_redis).toEqual(expect.arrayContaining(expectedsites))
});
test(`${testSuiteName}: findAll with empty sites`, async () => {
  const sites: Site[] = []
  const expectedsites: Site[] = [];
  const sites_from_redis = await redisSiteRepository.findAll();
  expect(sites_from_redis.length).toEqual(sites.length);
  expect(sites_from_redis).toEqual(expect.arrayContaining(expectedsites));
});
test(`${testSuiteName}: findByGeo`, async () => {
  const site1 = {
    id: 1,
    capacity: 3.5,
    panels: 3,
    address: '637 Britannia Drive',
    city: 'Vallejo',
    countryCode: 'US',
    state: 'CA',
    postalCode: '94591',
    coordinate: {
      lat: 38.10476999999999,
      lng: -122.193849,
    },
  };

  const site2 = {
    id: 2,
    capacity: 4.5,
    panels: 3,
    address: '31353 Santa Elena Way',
    city: 'Union City',
    countryCode: 'US',
    state: 'CA',
    postalCode: '94587',
    coordinate: {
      lat: 37.593981,
      lng: -122.059762,
    },
  };

  const site3 = {
    id: 3,
    capacity: 4.5,
    panels: 3,
    address: '1732 27th Avenue',
    countryCode: 'US',
    city: 'Oakland',
    state: 'CA',
    postalCode: '94601',
    coordinate: {
      lat: 37.783431,
      lng: -122.228238,
    },
  };
  await redisSiteRepository.insert(new Site(site1));
  await redisSiteRepository.insert(new Site(site2));
  await redisSiteRepository.insert(new Site(site3));
  // Find sites, expect 1.
  let response = await redisSiteRepository.findByGeo(37.804829, -122.272476, 10, 'km');
  expect(response.length).toBe(1);
  expect(response[0].Id).toBe(site3.id);

  // Find sites, expect 1.
  response = await redisSiteRepository.findByGeo(38.104086, -122.256637, 10, 'km');
  expect(response.length).toBe(1);
  expect(response[0].Id).toBe(site1.id);

  // Find Union City sites, expect 1.
  response = await redisSiteRepository.findByGeo(37.596323, -122.081630, 10, 'km');
  expect(response.length).toBe(1);
  expect(response[0].Id).toBe(site2.id);

  // Larger Radius should return all 3 sites.
  response = await redisSiteRepository.findByGeo(37.596323, -122.081630, 60, 'km');
  expect(response.length).toBe(3);
  expect(response[0].Id).toBe(site2.id);
  expect(response[1].Id).toBe(site3.id);
  expect(response[2].Id).toBe(site1.id);
});
/* eslint-enable */
