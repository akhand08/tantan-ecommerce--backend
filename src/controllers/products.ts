import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { ProductSchema } from "../schema/products";
import { BadRequestException, ErrorCode } from "../exceptions/root";
import { NotFoundException, UnprocessableEntity } from "../exceptions/exception_handle";


export const createProduct = async (req: Request, res: Response, next: NextFunction) => {

    const validationResult = ProductSchema.safeParse(req.body)
    if(!validationResult.success) {
        throw new UnprocessableEntity("Unprocessable Entity", ErrorCode.UNPROCESSABLE_ENTITY, validationResult.error);
    }

    const product = await prismaClient.product.create({
        data: {
            ...req.body,
            "tags": req.body.tags.join(',')
        }
    })

    if(!product) {
        throw new UnprocessableEntity("Unprocessable Entity", ErrorCode.UNPROCESSABLE_ENTITY, validationResult.error);
    }


    res.json(product);
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {

    try{
        const product = req.body;
        if(product.tags) {
            product.tags = product.tags.join(',');
        }

        const updatedProduct = await prismaClient.product.update({
            "where": {
                id: +req.params.id
            },
            "data": product
        })

        res.json(updatedProduct);

    }catch(error) {
        throw new NotFoundException("Product Not Found", ErrorCode.PRODUCT_NOT_FOUND, null);
    }

}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {

    try{

        const productId = +req.params.id;
        const deletedUser = await prismaClient.product.delete({
            where: {
                id: productId
            }
        })

    }catch {
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND, null)
    }

    res.send("Product has been deleted");

}

export const listProducts = async (req: Request, res: Response, next: NextFunction) => {


    const count = await prismaClient.product.count();
    const skip = typeof(req.query.skip) == 'string' ? +req.query.skip : 0;
    const products = await prismaClient.product.findMany({
        skip,
        take: 5
    })

    res.json({
        count, data: products
    })

}


export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: +req.params.id
            }
        })

        res.json(product);
    }catch(error){
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND, null);
    }

}
