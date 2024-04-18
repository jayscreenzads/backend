import { Request, Response } from "express";
import { prismaClient } from "../server";
import asyncHandler from "express-async-handler";
import { s3Uploadv3 } from "../lib/driverS3Service";
import s3 from "../lib/s3Config";
import * as mime from "mime-types";
const uuid = require("uuid").v4;
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

export const createDriver = async (req: Request, res: Response) => {
  const {
    dl,
    ssn,
    preferredLoc,
    dateRegistered,
    dateApproved,
    userId,
    fileSource,
  } = req.body;

  console.log("createDriver");

  const driver = await prismaClient.driver.create({
    data: {
      dl,
      ssn,
      preferredLoc,
      dateRegistered,
      dateApproved,
      userId: parseInt(userId),
    },
  });

  let images: any = {
    images: null,
  };

  // Save metadata to Prisma database
  if (driver) {
    if (fileSource?.length > 0) {
      fileSource?.map((base64: any) => {
        if (base64 === "") {
          return "";
        }
        const base64Data = Buffer.from(
          base64.replace(/^data:\w+\/[a-zA-Z+\-.]+;base64,/, ""),
          "base64"
        );

        const type = base64.split(";")[0].split("/")[1];
        const data: any = {
          Bucket: process.env.DO_BUCKET_NAME,
          Key: `drivers/${uuid()}.${type}`,
          Body: base64Data,
          ContentEncoding: "base64",
          ContentType:
            mime.lookup(`${uuid()}.${type}`) || "application/octet-stream", //We add 'application/octet-stream' in case mym-types can't read our file typee
          ACL: "public-read",
        };
        try {
          s3.putObject(data, function (err, data) {
            if (err) {
              console.log(err);
              console.log("Error uploading data: ", data);
            } else {
              console.log("successfully uploaded the image!");
            }
          }).promise();
          console.log("success upload: ", data);
        } catch (error: any) {
          //handle error
          res
            .status(error?.status || 400)
            .send(error?.message || "Something went wrong!");
        }
      });
    }

    res.json({
      message: "Created a driver success",
      result: "true",
      data: { driver },
    });
  }
};

export const updateDriver = asyncHandler(
  async (req: Request, res: Response) => {
    const driverId = req.params.id;
    const { dl, ssn, preferredLoc, dateRegistered, dateApproved } = req.body;

    const driver = await prismaClient.driver.update({
      where: { id: parseInt(driverId) },
      data: {
        dl,
        ssn,
        preferredLoc,
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
