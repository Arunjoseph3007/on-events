import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import db from "../db";
import { users } from "../db/schema";
import UnAuthorizedError from "../error/unauthorized";

export const getUser = async (email: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  return user;
};

export const verifyLogin = async (email: string, password: string) => {
  const user = await getUser(email);
  if (!user) {
    throw new UnAuthorizedError("Invalid username or password");
  }

  const passwordIsValid = await bcrypt.compare(password, user.passwordHash);
  if (!passwordIsValid) {
    throw new UnAuthorizedError("Invalid username or password");
  }

  const { passwordHash, ...userDetails } = user;

  return userDetails;
};

export const registerUser = async (
  email: string,
  password: string,
  fullName: string
) => {
  const existingUser = await getUser(email);
  if (existingUser) {
    throw new Error("A user with that email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.insert(users).values({ email, fullName, passwordHash });
};
