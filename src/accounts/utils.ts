import { jwt } from "../utils/jwt";
import UnAuthorizedError from "../error/unauthorized";

export const createAccessToken = async (
  id: number,
  email: string,
  name: string
) => {
  const payload = { id, email, name };
  const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, "24 h");
  return token;
};

export const createRefreshToken = (id: number, email: string, name: string) => {
  const payload = { id, email, name };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, "360 d");
  return token;
};

export const verifyToken = async (token: string) => {
  try {
    const verified = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    return verified as {
      id: number;
      email: string;
      name: string;
    };
  } catch {
    throw new UnAuthorizedError("Invalid token");
  }
};
