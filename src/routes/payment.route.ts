import { Router } from "express";
import express from "express";
import bodyParser from "body-parser";
import {
  addCard,
  createCustomer,
  createCharge,
  createProduct,
  createCheckoutSession,
  getPaymentWebhook,
} from "../controllers/payment.controller";
import { auth } from "../middlewares/verifyToken";
// import { upload } from "../lib/s3Config";

const paymentRoutes: Router = Router();

paymentRoutes.post("/create-customer", createCustomer);
paymentRoutes.post("/add-card", addCard);
paymentRoutes.post("/create-charge", createCharge);
paymentRoutes.post("/create-product", createProduct);
paymentRoutes.post("/create-checkout-session", createCheckoutSession);
paymentRoutes.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  getPaymentWebhook
);

export default paymentRoutes;
