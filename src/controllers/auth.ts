import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { ErrorCode } from "../exceptions/root";
import { BadRequestException, NotFoundException, UnprocessableEntity } from "../exceptions/exception_handle";
import { SignUpSchema } from "../schema/users";



export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
    const authValidationResult = SignUpSchema.safeParse(req.body);
    if(!authValidationResult.success) {
      throw new UnprocessableEntity("Unprocessable Entity", ErrorCode.UNPROCESSABLE_ENTITY, authValidationResult.error);
    }

    const { name, email, password } = req.body;

    let user = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    if (user) {
      throw new BadRequestException("User already exist", ErrorCode.USER_ALREADY_EXIST, null)
    }

    user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
      },
    });

    res.json(user);
  
};


export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email: email } });
  if (!user) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND, null);
  }

  if (!compareSync(password, user.password)) {
    throw new BadRequestException("Incorrect Password", ErrorCode.INCORRECT_PASSWORD, null);
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET
  );

  res.json({ user, token });
};



export const me = async (req: Request, res: Response, next: NextFunction) => {

  res.json(req.user);
}