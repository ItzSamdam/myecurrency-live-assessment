import bcrypt from "bcrypt";

/**
 * Hash a password using bcrypt
 * @param password Password to hash
 */
// Number of rounds for bcrypt salt generation (higher is more secure but slower)
const saltRounds = 10;
async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Determine if a password matches a hash using bcrypt
 * @param inputPassword
 * @param hashedPassword
 * @returns
 */
async function comparePassword(inputPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

export { hashPassword, comparePassword };
