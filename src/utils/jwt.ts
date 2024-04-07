import { SignJWT, jwtVerify, type JWTPayload } from "jose";

async function sign(
  payload: JWTPayload,
  secret: string,
  expiry: string
): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);

  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expiry)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(secret));
}

async function verify(
  token: string,
  secret: string
): Promise<JWTPayload | null> {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
  const { aud, exp, iat, iss, jti, nbf, sub, ...detail } = payload;

  return detail;
}

export const jwt = { sign, verify };
