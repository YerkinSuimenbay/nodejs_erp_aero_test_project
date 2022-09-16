import bcrypt from "bcrypt";
import { db } from "../../utils/db.server";
import { BadRequestError } from "../../errors";
import { jwtSign } from "../../utils/generate-token";

type User = {
  userId: string;
  password: string;
};

export async function register(
  userId: string,
  password: string
): Promise<User> {
  const hashedPassword = await hashPassword(password);
  return db.user.create({
    data: {
      userId,
      password: hashedPassword,
    },
  });
}

export async function login(userId: string, password: string) {
  const user = await db.user.findFirst({ where: { userId } });

  if (!user) {
    throw new BadRequestError("User not found"); // TODO: fix this
  }

  const isValid = await isValidPassword(password, user.password);
  if (!isValid) {
    throw new BadRequestError("Invalid credentials"); // TODO: fix this
  }

  const { token, refreshToken } = jwtSign({
    userId,
    issueTime: new Date(),
  });

  return { token, refreshToken };
}

export async function logout(userId: string) {
  await db.user.update({
    where: { userId },
    data: { lastLogoutTime: new Date() },
  });
  return true;
}

function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

function isValidPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}
