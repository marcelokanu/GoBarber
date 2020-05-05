import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  // Validação do token JWT

  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  // formato token: Beader 9820jfdsjlkasu09821
  // deixar variavel desestruturada sem escrever ( [ , token ]) funciona e representa não precisar dela
  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as TokenPayload; // Forçando tipo de variavel

    request.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    throw new AppError('Invalide JWT token', 401);
  }
}
