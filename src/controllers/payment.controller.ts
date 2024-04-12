import { Request, Response } from "express";
import { prismaClient } from "../server";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, active, default_price } = req.body;
    const productInfo = {
      name: "Screen 1",
      description: "Roof Screen Size 50 inches",
      active: true,
    };

    const product = await stripe.products.create(productInfo);

    console.log("product: ", product);

    if (product?.id) {
      // Create price for the product
      const price = await stripe.prices.create({
        unit_amount: default_price, // Price in cents
        currency: "usd", // Change this to your desired currency
        product: product.id,
      });

      console.log("price: ", price);

      if (price?.id) {
        const productTbl = await prismaClient.product.create({
          data: {
            name,
            description,
            active,
            default_price,
            stripeProductId: product.id,
            stripePriceId: price.id,
          },
        });

        console.log("productTbl: ", productTbl);

        res.json({
          message: "Created a payment success",
          result: "true",
          data: { product },
        });
      }
    }
  } catch (error) {}
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, email, phone } = req.body;

    const customer: Stripe.Customer = await stripe.customers.create({
      name,
      email,
      phone,
    });

    if (customer?.id) {
      const customerTbl = await prismaClient.customer.create({
        data: {
          name,
          email,
          phone,
          stripeCustomerId: customer.id,
        },
      });

      console.log("customer: ", customer);
      console.log("customerTbl: ", customerTbl);
      res.status(200).send({
        message: "Created a vehicle success",
        result: "true",
        data: { customer },
      });

      console.log(customer.id);
    }
  } catch (error) {}
};

export const addCard = async (req: Request, res: Response) => {
  try {
    const {
      customer_id,
      card_name,
      card_expYear,
      card_expMonth,
      card_number,
      card_cvc,
    } = req.body;

    const card_token = await stripe.tokens.create({
      card: {
        name: card_name,
        number: card_number,
        exp_year: card_expYear,
        exp_month: card_expMonth,
        cvc: card_cvc,
      },
    });

    const card = await stripe.customers.createSource(customer_id, {
      source: `${card_token.id}`,
    });

    res.status(200).send({
      message: "Created a vehicle success",
      result: "true",
      data: { card },
    });
  } catch (error) {
    console.log(error);
  }
};

export const createCharge = async (req: Request, res: Response) => {
  try {
    const { email, amount, card_id, description, customer_id } = req.body;

    const createCharges = await stripe.charges.create({
      receipt_email: email,
      amount: amount,
      currency: "USD",
      description,
      customer: customer_id,
    });

    if (createCharges) {
      const charges = await prismaClient.charges.create({
        data: {
          email,
          amount,
          card_id,
          description,
          customer_id,
          stripeChargeId: createCharges.id,
        },
      });
      console.log("charges: ", charges);
      res.status(200).send({
        message: "Created a vehicle success",
        result: "true",
        data: { createCharges },
      });
    }
  } catch (error) {}
};

// easiest way to have payment
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { productName, productDescription, productPrice } = req.body;

    const lineItem = {
      price_data: {
        currency: "usd",
        product_data: {
          name: productName,
          description: productDescription,
        },
        unit_amount: Math.round(productPrice * 100),
      },
      quantity: 1,
    };

    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        line_items: [lineItem],
        mode: "payment",
        success_url: `${process.env.AGENT_DRIVER_PORTAL_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.AGENT_DRIVER_PORTAL_URL}/payment`,
      },
      {
        apiKey: process.env.STRIPE_SECRET_KEY,
      }
    );

    res.status(200).send({ id: session.id });

    // if (session) {
    //   const charges = await prismaClient.charges.create({
    //     data: {
    //       email,
    //       amount,
    //       card_id,
    //       description,
    //       customer_id,
    //       stripeChargeId: createCharges.id,
    //     },
    //   });
    //   console.log("charges: ", charges);
    //   res.status(200).send({
    //     message: "Created a vehicle success",
    //     result: "true",
    //     data: { createCharges },
    //   });
    // }
  } catch (error) {}
};
