import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { ProductSchema } from "../schema/products";
import { BadRequestException, ErrorCode } from "../exceptions/root";


export const createProduct = async (req: Request, res: Response, next: NextFunction) => {

    const validationResult = ProductSchema.safeParse(req.body)
    if(validationResult.success) {
        throw new 
    }

    const product = await prismaClient.product.create({
        data: {
            ...req.body,
            "tags": req.body.tags.join(',')
        }
    })

    if(!product) {
        throw new BadRequestException("Product is not created", ErrorCode.PRODUCT_CREATION_FAILURE, 401, null);
    }


    res.json(product);
}