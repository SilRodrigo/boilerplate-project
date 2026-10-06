import { SignJWT, jwtVerify, errors } from 'jose';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../core/config';

const ALGORITHM = 'HS256';

export interface IAccessTokenPayload {
  userId: string;
}

const secretKey = () => new TextEncoder().encode(JWT_SECRET);

export function signAccessToken(payload: IAccessTokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secretKey());
}

/** Throws TokenExpiredError or InvalidTokenError. */
export async function verifyAccessToken(token: string): Promise<IAccessTokenPayload> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: [ALGORITHM] });

    if (typeof payload.userId !== 'string') throw new InvalidTokenError();

    return { userId: payload.userId };
  } catch (error) {
    if (error instanceof errors.JWTExpired) throw new TokenExpiredError();
    throw new InvalidTokenError();
  }
}

export class TokenExpiredError extends Error { }

export class InvalidTokenError extends Error { }
