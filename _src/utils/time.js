export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function epochNow() {
  return Math.floor(new Date() / 1000);
}
