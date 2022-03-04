import { InvalidSiteError } from '../../../src/domain/invalidSiteError';
import { Site } from '../../../src/domain/site';
test('should create an instance of site', () => {
  const param = {
    id: 4,
    capacity: 5.5,
    panels: 4,
    countryCode: 'US',
    address: '910 Pine St.',
    city: 'Oakland',
    state: 'CA',
    postalCode: '94577',
  };
  const site = new Site(param);
  expect(site).toBeInstanceOf(Site);
});
test('should create an instance of site with lng lat', () => {
  const param = {
    id: 4,
    capacity: 5.5,
    panels: 4,
    address: '910 Pine St.',
    city: 'Oakland',
    state: 'CA',
    postalCode: '94577',
    lat: 37.739659,
    lng: -122.255689
  };
  const site = new Site(param);
  expect(site).toBeInstanceOf(Site);
  expect(site.coordinate.lat).toEqual(37.739659);
  expect(site.coordinate.lng).toEqual(-122.255689);
});
test('should create an instance of site with coordinate', () => {
  const param = {
    id: 4,
    capacity: 5.5,
    panels: 4,
    address: '910 Pine St.',
    city: 'Oakland',
    state: 'CA',
    postalCode: '94577',
    coordinate: {
      lat: 37.739659,
      lng: -122.255689,
    }
  };
  const site = new Site(param);
  expect(site).toBeInstanceOf(Site);
  expect(site.coordinate.lat).toEqual(37.739659);
  expect(site.coordinate.lng).toEqual(-122.255689);
});
test('should throw Error invalid nstance', () => {
  const param = {}
  expect(() => new Site
    (param)).toThrow(InvalidSiteError);
});
test('should throw Error panels should be >0', () => {
  const param = {
    id: 4,
    capacity: 5.5,
    panels: NaN,
    countryCode: 'US',
    address: '910 Pine St.',
    city: 'Oakland',
    state: 'CA',
    postalCode: '94577',
  };
  expect(() => new Site
    (param)).toThrow(InvalidSiteError);
});
test('should throw Error id should be >0', () => {
  const param = {
    id: NaN,
    capacity: 5.5,
    panels: 4,
    countryCode: 'US',
    address: '910 Pine St.',
    city: 'Oakland',
    state: 'CA',
    postalCode: '94577',
  };
  expect(() => new Site
    (param)).toThrow(InvalidSiteError);
});
test('country_code should exist', () => {
  const param = {
    id: 4,
    capacity: 5.5,
    panels: 4,
    countryCode: 'XX',
    address: '910 Pine St.',
    city: 'Oakland',
    state: 'CA',
    postalCode: '94577',
  };
  expect(() => new Site
    (param)).toThrow(InvalidSiteError);
});
test('postalCode should be valid', () => {
  const param = {
    id: 4,
    capacity: 5.5,
    panels: 4,
    countryCode: 'US',
    address: '910 Pine St.',
    city: 'Oakland',
    state: 'CA',
    postalCode: '9457756',
  };
  expect(() => new Site
    (param)).toThrow(InvalidSiteError);
});
test('capacity should be provided', () => {
  const param = {
    id: 4,
    capacity: NaN,
    panels: 4,
    countryCode: 'US',
    address: '910 Pine St.',
    city: 'Oakland',
    state: 'CA',
    postalCode: '94577',
    lat: 37.739659,
    lng: -192.255689
  };
  expect(() => new Site
    (param)).toThrow(InvalidSiteError);
});
test('cootdinate should be valid', () => {
  const param = {
    id: 4,
    capacity: 5.5,
    panels: 4,
    countryCode: 'US',
    address: '910 Pine St.',
    city: 'Oakland',
    state: 'CA',
    postalCode: '94577',
    lat: 37.739659,
    lng: -192.255689
  };
  expect(() => new Site
    (param)).toThrow(InvalidSiteError);
})
test('Site toFlat', () => {
  const param = {
    id: 4,
    capacity: 5.5,
    panels: 4,
    countryCode: 'US',
    address: '910 Pine St.',
    city: 'Oakland',
    state: 'CA',
    postalCode: '94577',
    coordinate: {
      lat: 37.739659,
      lng: -122.255689,
    }
  };
  const expected = {
    id: 4,
    capacity: 5.5,
    panels: 4,
    countryCode: 'US',
    address: '910 Pine St.',
    city: 'Oakland',
    state: 'CA',
    postalCode: '94577',
    lat: 37.739659,
    lng: -122.255689,
  };

  expect(new Site(param).toFlat()).toEqual(expected);
})


