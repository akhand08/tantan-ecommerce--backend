import {Router} from 'express'
import authRoutes from './auth'
import productRoutes from './products';
import userRoutes from './users';
import cartRoutes from './cart';

const rootRouter: Router = Router()

rootRouter.use('/auth', authRoutes);
rootRouter.use('/products', productRoutes);
rootRouter.use('/users', userRoutes);
rootRouter.use('/carts', cartRoutes);

export default rootRouter;