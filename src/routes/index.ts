import { Router } from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import driverRoutes from "./driver.route";
import vehicleRoutes from "./vehicle.route";
import statisticRoutes from "./statistic.route";
import paymentRoutes from "./payment.route";
import twilioRoutes from "./twilio.route";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/user", userRoutes);
rootRouter.use("/driver", driverRoutes);
rootRouter.use("/vehicle", vehicleRoutes);
rootRouter.use("/statistic", statisticRoutes);
rootRouter.use("/registration-payment", paymentRoutes);
rootRouter.use("/otp", twilioRoutes);

export default rootRouter;
