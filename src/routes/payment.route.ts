import { Router } from "express";
import {
  addCard,
  createCustomer,
  createCharge,
  createProduct,
  createCheckoutSession,
} from "../controllers/payment.controller";
import { auth } from "../middlewares/verifyToken";

const paymentRoutes: Router = Router();

paymentRoutes.post("/create-customer", createCustomer);
paymentRoutes.post("/add-card", addCard);
paymentRoutes.post("/create-charge", createCharge);
paymentRoutes.post("/create-product", createProduct);
paymentRoutes.post("/create-checkout-session", createCheckoutSession);

export default paymentRoutes;
