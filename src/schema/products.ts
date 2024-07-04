import {z} from 'zod'


export const ProductSchema = z.object({

    name: z.string(),
    description: z.string().min(10).max(200),
    price: z.number().positive().finite().multipleOf(0.01),
    tags: z.array(z.string())

})