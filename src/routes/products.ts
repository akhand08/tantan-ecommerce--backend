import { Router } from "express";
import { errorHandler } from "../error_handler";
import { createProduct } from "../controllers/products";
import { authMiddleware } from "../middlewares/auth";


const productRoutes: Router = Router();


productRoutes.post('/', [authMiddleware] errorHandler(createProduct))

export default productRoutes;
