import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/exception_handle";
import { ErrorCode } from "../exceptions/root";
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization;


    if(!token) {
        throw new UnauthorizedException("Unauthorized", ErrorCode.Unauthorized, null)
    }

    try{

        const payload = jwt.verify(token, JWT_SECRET) as any;
        const user = await prismaClient.user.findFirst({where: {id: payload.userId}});

        if(!user) {
            throw new UnauthorizedException("Unauthorized", ErrorCode.Unauthorized, null);
        }

        req.user = user;
        next();

    }catch(error) {
        throw new UnauthorizedException("Unauthorized", ErrorCode.Unauthorized, null);
    }



}