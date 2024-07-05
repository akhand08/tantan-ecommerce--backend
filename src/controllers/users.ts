import { NextFunction, Request, Response } from "express";
import { AddressSchema, UpdateUserSchema } from "../schema/users";
import { NotFoundException, UnprocessableEntity } from "../exceptions/exception_handle";
import { BadRequestException, ErrorCode } from "../exceptions/root";
import { Address, User } from "@prisma/client";
import { prismaClient } from "..";


export const addAddress = async (req: Request, res: Response, next: NextFunction) => {
    const addressValidationResult = AddressSchema.safeParse(req.body);

    if(!addressValidationResult.success) {
        throw new UnprocessableEntity("Validation on Address Data", ErrorCode.UNPROCESSABLE_ENTITY, addressValidationResult.error);
    }

    const address = await prismaClient.address.create({data: {
        ...req.body,
        userId: req.user.id
    }})

    res.json(address);

}

export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
    try{
        await prismaClient.address.delete({where: {
            id: +req.params.id
        }
        })

        res.json({success: true});

    }catch(error) {
        throw new NotFoundException("Address Not Found", ErrorCode.ADDRESS_NOT_FOUND, null);
    }
    
}

export const listAddress = async (req: Request, res: Response, next: NextFunction) => {

    let addresses = await prismaClient.address.findMany({

        where: {
            userId: req.user.id
        }
    })

    res.json(addresses);

    
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const updateUserValidationResult = UpdateUserSchema.safeParse(req.body);

    if(!updateUserValidationResult.success) {
        throw new UnprocessableEntity("Data is unprocessable", ErrorCode.UNPROCESSABLE_ENTITY, updateUserValidationResult.error);
    }
    let shippingAddress : Address;
    let billingAddress: Address;

    if(updateUserValidationResult.data.defaultShippingAddress) {
        try{

            shippingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: updateUserValidationResult.data.defaultShippingAddress
                }
            })

        } catch(error) {
            throw new NotFoundException("Shipping Address Not found", ErrorCode.ADDRESS_NOT_FOUND, null);
        }

        if (shippingAddress.userId !== req.user.id) {
            throw new BadRequestException("Address does not belong to user", ErrorCode.ADDRESS_NOT_FOUND, 400, null);
        }
    }

    


    if(updateUserValidationResult.data.defaultBillingAddress) {
        try{

            billingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: updateUserValidationResult.data.defaultBillingAddress
                }
            })

        } catch(error) {
            throw new NotFoundException("Shipping Address Not found", ErrorCode.ADDRESS_NOT_FOUND, null);
        }

        if (billingAddress.userId !== req.user.id) {
            throw new BadRequestException("Address does not belong to user", ErrorCode.ADDRESS_NOT_FOUND, 400, null);
        }
    }

    const updateUser = await prismaClient.user.update({
        where: {
            id: req.user.id
        },
        data: updateUserValidationResult
    })

    res.json(updateUser);





  }

