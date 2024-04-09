import { Request, Response } from "express";
import { prismaClient } from "../server";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const getDrivers = asyncHandler(async (req: Request, res: Response) => {
  const drivers = await prismaClient.driver.findMany();

  res.json({
    message: "Fetched all drivers success",
    result: "true",
    data: { drivers },
  });
});

export const getDriver = asyncHandler(async (req: Request, res: Response) => {
  const driverId = req.params.id;
  const driver = await prismaClient.driver.findUnique({
    where: { id: parseInt(driverId) },
  });

  res.json({
    message: "Fetched a driver success",
    result: "true",
    data: { driver },
  });
});

export const createDriver = asyncHandler(
  async (req: Request, res: Response) => {
    const { DL, SSN, preferredLocation, dateRegistered, dateApproved, userId } =
      req.body;

    console.log("createDriver");

    const driver = await prismaClient.driver.create({
      data: {
        DL,
        SSN,
        preferredLocation,
        dateRegistered,
        dateApproved,
        userId,
      },
    });

    res.json({
      message: "Created a driver success",
      result: "true",
      data: { driver },
    });
  }
);

export const updateDriver = asyncHandler(
  async (req: Request, res: Response) => {
    const driverId = req.params.id;
    const { DL, SSN, preferredLocation, dateRegistered, dateApproved } =
      req.body;

    const driver = await prismaClient.driver.update({
      where: { id: parseInt(driverId) },
      data: {
        DL,
        SSN,
        preferredLocation,
        dateRegistered,
        dateApproved,
      },
    });

    res.json({
      message: "Updated a driver success",
      result: "true",
      data: { driver },
    });
  }
);

export const deleteDriver = asyncHandler(
  async (req: Request, res: Response) => {
    const driverId = req.params.id;

    console.log("deleteDriver");

    const driver = await prismaClient.driver.delete({
      where: { id: parseInt(driverId) },
    });

    res.json({
      message: "Deleted a driver success",
      result: "true",
      data: { driver },
    });
  }
);
