import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const HASH_PREFIX = "scrypt";
const KEY_LENGTH = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");

  return `${HASH_PREFIX}$${salt}$${hash}`;
}

export function isHashedPassword(password: string) {
  return password.startsWith(`${HASH_PREFIX}$`);
}

export function verifyPassword(password: string, storedPassword: string) {
  if (!isHashedPassword(storedPassword)) {
    return password === storedPassword;
  }

  const parts = storedPassword.split("$");

  if (parts.length !== 3) {
    return false;
  }

  const [, salt, storedHash] = parts;

  const hashBuffer = scryptSync(password, salt, KEY_LENGTH);
  const storedHashBuffer = Buffer.from(storedHash, "hex");

  if (hashBuffer.length !== storedHashBuffer.length) {
    return false;
  }

  return timingSafeEqual(hashBuffer, storedHashBuffer);
}