import { NextFunction, Request, Response } from "express";
import { ChangeQuantitySchema, CreateCartSchema } from "../schema/cart";
import { NotFoundException, UnprocessableEntity } from "../exceptions/exception_handle";
import { BadRequestException, ErrorCode } from "../exceptions/root";
import { prismaClient } from "..";


export const addItemToCart = async (req: Request, res: Response, next: NextFunction) => {



    // task left: check for the existence of the product in the cart



    const cartValidationResult = CreateCartSchema.safeParse(req.body);
    if(!cartValidationResult.success) {
        throw new UnprocessableEntity("Unprocessable Entity", ErrorCode.UNPROCESSABLE_ENTITY, cartValidationResult.error);
    }

    const product = await prismaClient.product.findFirst({where: {
        id: cartValidationResult.data.productId
    }})

    if (!product) {
        throw new NotFoundException("Product Not found", ErrorCode.PRODUCT_NOT_FOUND, null);
    }

    const cart = await prismaClient.cartItems.create({
        data: {
            userId: req.user?.id as number,
            productId: cartValidationResult.data.productId,
            quantity: cartValidationResult.data.quantity
        }
    })

    res.json(cart);

}

export const deleteItemFromCart = async (req: Request, res: Response, next: NextFunction) => {

    const cart = await prismaClient.cartItems.findFirst({

        where: {
            id: +req.params.id
        }
    })

    if(!cart) {
        throw new NotFoundException("Cart Not Found", ErrorCode.CART_NOT_FOUND, null);
    }

    if( req.user?.id !== cart.userId ) {
        throw new BadRequestException("Cart doest not belong to user", ErrorCode.CART_NOT_FOUND, 400, null);
    }

    await prismaClient.cartItems.delete({
        where: {
            id: +req.params.id
        }
    })

}

export const changeQuantity = async (req: Request, res: Response, next: NextFunction) => {

    const quantityValidationResult = ChangeQuantitySchema.safeParse(req.body);

    if(! quantityValidationResult.success) {
        throw new UnprocessableEntity("Unprocessable Entity", ErrorCode.UNPROCESSABLE_ENTITY, quantityValidationResult.error);
    }

    const cart = await prismaClient.cartItems.findFirst({

        where: {
            id: +req.params.id
        }
    })

    if(!cart) {
        throw new NotFoundException("Cart Not Found", ErrorCode.CART_NOT_FOUND, null);
    }

    if( req.user?.id !== cart.userId ) {
        throw new BadRequestException("Cart doest not belong to user", ErrorCode.CART_NOT_FOUND, 400, null);
    }

    const updatedCart = await prismaClient.cartItems.update({
        where:{
            id: +req.params.id
        },
        data: {
            quantity: quantityValidationResult.data.quantity
        }
    })

    res.json(updatedCart);



}

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
    const cart = await prismaClient.cartItems.findMany({
        where: {
            id: req.user?.id
        },
        include: {
            product: true
        }    
    })

    res.json(cart);

}