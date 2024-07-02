import express, {Express, Request, Response} from 'express'
import { PORT } from './secrets';
import rootRouter from './routes';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware} from './middlewares/error';
import { SignUpSchema } from './schema/users';

const app: Express = express();




app.use(express.json())

app.use(rootRouter);
app.use(errorMiddleware);

export const prismaClient = new PrismaClient({
    log:['query']
})


app.listen(PORT, () => {
    console.log(`TanTan app is listening to port 3000`);
})