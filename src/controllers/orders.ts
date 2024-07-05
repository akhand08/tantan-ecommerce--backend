import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException, UnauthorizedException } from "../exceptions/exception_handle";
import { ErrorCode } from "../exceptions/root";


export const createOrder = async (req: Request, res: Response, next: NextFunction)  => {

    if(!req.user) {
        throw new UnauthorizedException("Unauthorized Error", ErrorCode.Unauthorized, null)
    }

    return await prismaClient.$transaction(async (tx) => {
        const allCartItems = await tx.cartItems.findMany({
            where: {
                userId: req.user?.id
            },
            include: {
                product: true
            }
        })

        if (allCartItems.length == 0) {
            return res.json({message: "Cart is empty"})
        }

        const price = allCartItems.reduce((prev, curr) => {
            return prev + (curr.quantity * +curr.product.price);
        }, 0);
        
        
        const address = await tx.address.findFirst({
            where: {
                id: req.user?.defaultShippingAddress as number
            }
        })

        const order = await tx.order.create({
            data: {
                userId: req.user?.id,
                netAmount: price,
                address: address?.formattedAddress as string,
                products: {
                    create: allCartItems.map((cart) => {
                        return {
                            productId: cart.productId as number,
                            quantity: cart.quantity
                        }
                    })
                }


            }
        })

        const orderEvent = await tx.orderEvent.create({
            data: {
                orderId: order.id
            }
        })

        await tx.cartItems.deleteMany({
            where: {
                userId: req.user?.id
            }
        })


        return res.json(order)


    })

}



export const listOrders = async (req: Request, res: Response, next: NextFunction)  => {

    const orders = await prismaClient.order.findMany({
        where: {
            userId: req.user?.id
        }
    })
    res.json(orders);
}

export const cancelOrder = async (req: Request, res: Response, next: NextFunction)  => {

    try{
        const order = await prismaClient.order.findFirst({
            where: {
                id: +req.params.id
            }
        })


        if(!order) {
            throw new NotFoundException("Order Not Found", ErrorCode.ORDER_NOT_FOUND, null);
        }

        await prismaClient.orderEvent.update({
            where: {
                id: order?.id 
            },
            data: {
                status: "CANCELLED"
            }
        })

    }catch(error){
        throw new NotFoundException("Order Not Found", ErrorCode.ORDER_NOT_FOUND, null);
    }
    
}

export const getOrderById = async (req: Request, res: Response, next: NextFunction)  => {

    try{
        const order = await prismaClient.order.findFirstOrThrow({
            where: {
                id: +req.params.id
            },
            include: {
                products: true,
                events: true
            }
        })

        res.json(order);

    }catch(error){
        throw new NotFoundException("Order Not Found", ErrorCode.ORDER_NOT_FOUND, null);
    }
    
}