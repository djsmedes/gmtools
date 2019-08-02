export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function epochNow() {
  return Math.floor(new Date() / 1000);
}

/**
 *
 * @param {Number} seconds
 * @param {Function} tick
 * @param {Function} callback
 * @param {Number} msPerTick
 */
export function countdown(
  seconds,
  tick,
  callback = () => {},
  msPerTick = 1000
) {
  let count = seconds;
  tick(count);
  let interval = setInterval(() => {
    count -= 1;
    if (count > 0) {
      tick(count);
    } else {
      callback();
      clearInterval(interval);
    }
  }, msPerTick);
}
