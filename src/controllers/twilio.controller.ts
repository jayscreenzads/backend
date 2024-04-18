import { Request, Response } from "express";
import { prismaClient } from "../server";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
var crypto = require("crypto");

const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_SID
);

export const sendOTP = async (req: Request, res: Response) => {
  const { countryCode, phoneNumber } = req.body;

  try {
    const otpResponse = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({
        to: `${countryCode}${phoneNumber}`,
        channel: "sms",
      });

    res.status(200).send({
      message: `OTP send successfully!: ${JSON.stringify(otpResponse)}`,
      result: "true",
    });
  } catch (error: any) {
    res
      .status(error?.status || 400)
      .send(error?.message || "Something went wrong!");
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { countryCode, phoneNumber, otp } = req.body;

  try {
    const verifiedResponse = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: `${countryCode}${phoneNumber}`,
        code: otp,
      });

    res.status(200).send({
      message: `OTP verified successfully!: ${JSON.stringify(
        verifiedResponse
      )}`,
      result: "true",
      data: { otpVerified: true },
    });
  } catch (error: any) {
    res
      .status(error?.status || 400)
      .send(error?.message || "Something went wrong!");
  }
};
