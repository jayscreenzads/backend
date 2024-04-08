import { Router } from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/user", userRoutes);

export default rootRouter;
