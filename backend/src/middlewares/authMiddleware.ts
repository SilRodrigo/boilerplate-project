import { Request, Response, NextFunction } from "express";
import { AwilixContainer } from "awilix";
import { PrismaUserRepository } from "../core/repositories";
import { errorResponse } from "../helpers/response";
import { IUser } from "../core/entities/user";
import { InvalidTokenError, TokenExpiredError, verifyAccessToken } from "../libs/jwt";

export interface AuthRequest extends Request {
  user?: IUser;
  container: AwilixContainer;
}

export const authMiddleware = async (request: Request, res: Response, next: NextFunction) => {
  const req = request as AuthRequest;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(res, new Error("Token não fornecido"), 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const { userId } = await verifyAccessToken(token);

    const userRepository = req.container.resolve<PrismaUserRepository>('prismaUserRepository');
    const user = await userRepository.findById(userId);

    if (!user) {
      return errorResponse(res, new Error("Usuário não encontrado"), 401);
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      return errorResponse(res, new Error("Token expirado"), 401);
    } else if (error instanceof InvalidTokenError) {
      return errorResponse(res, new Error("Token inválido"), 401);
    }

    return errorResponse(res, error || new Error("Erro inesperado na autenticação"), 401);
  }
};

/** Use after authMiddleware to restrict a route to admins. */
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if ((req as AuthRequest).user?.userType !== 'ADMIN') {
    return errorResponse(res, new Error("Acesso negado"), 403);
  }

  next();
};
