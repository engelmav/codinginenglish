import { isInSession } from './util';
import { DateTime, Duration, Interval } from "luxon";


it('calculates if in time window', () => {
  // the class started two minutes ago.
  const now = DateTime.utc();
  const twoMinutes = Duration.fromObject({ minutes: 2 })
  const twoMinutesAgo = now.minus(twoMinutes);
  const startDateTime = twoMinutesAgo.toISO();
  const inSession = isInSession(startDateTime, 90);
  expect(inSession).toBe(true)

  // the class is over: it started three hours ago and was only 90 minutes long.
  const threeHours = Duration.fromObject({ hours: 3 });
  const threeHoursAgo = now.minus(threeHours);
  const startDateTime2 = threeHoursAgo.toISO();
  const notInSession = isInSession(startDateTime2, 90);
  expect(notInSession).toBe(false);

  // the class starts in 3 hours.
  const futureDateTime = now.plus(threeHours);
  const futureStartDateTime = futureDateTime.toISO();
  const notInSession2 = isInSession(futureStartDateTime, 90);
  expect(notInSession2).toBe(false);
})