import { Router } from "express";
import { errorHandler } from "../error_handler";
import { authMiddleware } from "../middlewares/auth";
import { addAddress, updateUser } from "../controllers/users";


const userRoutes : Router = Router();

userRoutes.post("/address", [authMiddleware], errorHandler(addAddress));
userRoutes.delete("/address/:id", [authMiddleware], errorHandler(addAddress));
userRoutes.get("/address", [authMiddleware], errorHandler(addAddress));
userRoutes.get("/", [authMiddleware], errorHandler(updateUser))

export default userRoutes;