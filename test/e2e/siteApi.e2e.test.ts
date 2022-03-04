import supertest from 'supertest';
import { Site } from '../../src/domain/site';
import { SiteNotFoundError } from '../../src/domain/siteNotFoundError';
import * as redis_client from '../../src/repositories/impl/redis/redis_client';
import server from '../../src/server';
const redis = redis_client.getClient()
const testKeyPrefix = 'solarpower_test';
const request = supertest(server.app);

beforeAll(async () => {
  jest.setTimeout(6000);
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
describe('Site API e2e Tests', () => {
  it("should Creates a new site ", async () => {
    const res = await request.post("/api/v1/sites")
      .send({
        id: 4,
        capacity: 5.5,
        panels: 4,
        address: '910 Pine St.',
        city: 'Oakland',
        countryCode: 'US',
        state: 'CA',
        postalCode: '94577',
        coordinate: {
          lat: 37.739659,
          lng: -132.255689
        }
      });
    expect(res.status).toBe(201);
    expect(res.body).toBe("solarpower_test:sites:info:4");
  });
  it("should get geo-sites", async () => {
    const sites =
      [{
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
      await request.post("/api/v1/sites")
        .send(site);
    }
    const res = await request.get("/api/v1/sites");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining(expectedsites));
  });
  it("should get geo-site byId", async () => {

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
    const expected = new Site(site);
    await request.post("/api/v1/sites")
      .send(site);
    const res = await request.get("/api/v1/sites/4")
    expect(res.status).toBe(200);
    expect(res.body).toEqual(expected);
  });
  it("should geo-site byId throw not found error", async () => {
    const error: SiteNotFoundError = new SiteNotFoundError();
    const expectedJson = { title: error.name, message: 'site not found', };
    const res = await request.get("/api/v1/sites/15")
    expect(res.status).toBe(404);
    expect(res.body).toEqual(expectedJson);
  });
  it("should get near by sites", async () => {
    const expectedsites: Site[] = [];
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
    await request.post("/api/v1/sites")
      .send(site1);
    expectedsites.push(new Site(site1));
    await request.post("/api/v1/sites")
      .send(site2);
    expectedsites.push(new Site(site2));
    await request.post("/api/v1/sites")
      .send(site3);
    expectedsites.push(new Site(site3));
    const res = await request.get("/api/v1/sitesnearby?lat=37.804829&lng=-122.272476&radius=100&radiusUnit=km");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining(expectedsites));
  });

})