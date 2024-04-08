import { Request, Response } from "express";
import { prismaClient } from "../server";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await prismaClient.user.findMany();

  res.json({
    message: "Fetched all users success",
    result: "true",
    data: { users },
  });
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await prismaClient.user.findUnique({
    where: { id: parseInt(userId) },
  });

  res.json({
    message: "Fetched a user success",
    result: "true",
    data: { user },
  });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { email, firstName, middleName, lastName, suffixName } = req.body;

  const user = await prismaClient.user.update({
    where: { id: parseInt(userId) },
    data: {
      email,
      firstName,
      middleName,
      lastName,
      suffixName,
    },
  });

  res.json({
    message: "Updated a user success",
    result: "true",
    data: { user },
  });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;

  console.log("updateUser userId: ", userId);
  console.log("updateUser req.body: ", req.body);

  const user = await prismaClient.user.delete({
    where: { id: parseInt(userId) },
  });

  res.json({
    message: "Deleted a user success",
    result: "true",
    data: { user },
  });
});
