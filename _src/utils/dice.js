function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

export function average_roll(size, num = 1, constant = 0) {
  return Math.floor((num * (size + 1)) / 2) + constant;
}

export function random_roll(size, num = 1, constant = 0) {
  return (
    Array.from({ length: num }, () => rollDie(size)).reduce(
      (partial, term) => partial + term
    ) + constant
  );
}
