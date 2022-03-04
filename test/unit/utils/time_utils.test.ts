import { TimeUtils } from '../../../src/util/timeUtils'

const timeUtilsSuiteName = 'time_TimeUtilss';
test(`${timeUtilsSuiteName}:getMinuteOfDay`, async () => {
  const value = TimeUtils.getMinuteOfDay(62);
  expect(typeof (value)).toBe('number');
  expect(value).toBe(1);
});
test(`${timeUtilsSuiteName}:getMinuteOfDayUndefinedArg`, async () => {
  const value = TimeUtils.getMinuteOfDay(undefined);
  expect(typeof (value)).toBe('number');
  expect(value).toBeLessThanOrEqual(1440);
});
test(`${timeUtilsSuiteName}:getTimestampForMinuteOfDay`, async () => {
  const value = TimeUtils.getTimestampForMinuteOfDay(6299, 3);
  expect(typeof (value)).toBe('number');
  expect(value).toBe(180);
});
test(`${timeUtilsSuiteName}: getCurrentTimestamp`, () => {
  const before = Math.floor(new Date().getTime() / 1000);
  const ts = TimeUtils.getCurrentTimestamp();
  const after = Math.floor(new Date().getTime() / 1000);

  expect(before).toBeLessThanOrEqual(ts);
  expect(after).toBeGreaterThanOrEqual(ts);
});
test(`${timeUtilsSuiteName}: getCurrentTimestampMillis`, () => {
  const before = new Date().getTime();
  const ts = TimeUtils.getCurrentTimestampMillis();
  const after = new Date().getTime();

  expect(before).toBeLessThanOrEqual(ts);
  expect(after).toBeGreaterThanOrEqual(ts);
});
test(`${timeUtilsSuiteName}: getDateString`, () => {
  // January 1st 2019 00:00:59 UTC - 2019-01-01 - 1546300859
  expect(TimeUtils.getDateString(1546300859)).toBe('2019-01-01');
  // July 10th 2019 23:59:59 UTC - 2019-07-10 - 1562803199
  expect(TimeUtils.getDateString(1562803199)).toBe('2019-07-10');
  // November 22nd 2019 12:00:00 UTC - 2019-11-22 - 1574380800
  expect(TimeUtils.getDateString(1574380800)).toBe('2019-11-22');
  // February 29th 2020 22:15:00 UTC - 2020-02-29 (leap year) - 1583014500
  expect(TimeUtils.getDateString(1583014500)).toBe('2020-02-29');
});



