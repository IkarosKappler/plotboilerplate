/**
 * A quick implementation for a prime check.
 *
 * @date 2026-08-16
 * @version 1.0.0
 */

function isPrime(num) {
  if (num <= 1) return false; // Not prime
  if (num === 2) return true; // 2 is prime
  if (num % 2 === 0) return false; // Even numbers > 2 are not prime

  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) {
      return false;
    }
  }
  return true;
}
