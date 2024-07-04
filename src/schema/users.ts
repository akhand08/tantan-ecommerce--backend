import {z} from 'zod'



export const SignUpSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
})



export const AddressSchema = z.object({
    firstLine: z.string(),
    secondLine: z.string().nullable(),
    city: z.string(),
    country: z.string(),
    pincode: z.string().length(6)


})

export const UpdateUserSchema = z.object({
    name: z.string().nullable(),
    defaultShippingAddress: z.number().nullable(),
    defaultBillingAddress: z.number().nullable()
})