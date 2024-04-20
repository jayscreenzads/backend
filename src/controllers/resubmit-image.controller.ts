import { Request, Response } from "express";
import { prismaClient } from "../server";
import asyncHandler from "express-async-handler";
import nodemailer from "nodemailer";
import s3 from "../lib/s3Config";
import jwt from "jsonwebtoken";
import * as mime from "mime-types";
const uuid = require("uuid").v4;
import dotenv from "dotenv";
dotenv.config();

export const getAccounts = asyncHandler(async (req: Request, res: Response) => {
  const account = await prismaClient.user.findMany();

  res.json({
    message: "Fetched all account successfully",
    result: "true",
    data: { account },
  });
});

export const getAccount = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const account = await prismaClient.user.findUnique({
    where: { id: parseInt(userId) },
    include: {
      driver: true,
    },
  });

  if (!account || !userId) {
    res.status(404).json({
      status: 404,
      message: "User not found",
      errors: "User not found",
    });
  }

  res.json({
    message: "Fetched a account successfully",
    result: "true",
    data: { account },
  });
});

export const resubmitImage = async (req: Request, res: Response) => {
  const { userId, fileSource } = req.body;

  const user = await prismaClient.user.findUnique({
    where: { id: parseInt(userId) },
    include: {
      driver: true,
    },
  });

  if (!user || !userId) {
    res.status(404).json({
      status: 404,
      message: "User not found",
      errors: "User not found",
    });
  }

  if (user) {
    if (fileSource?.length > 0) {
      // add new images
      fileSource?.map((base64: any) => {
        if (base64 === "") {
          return "";
        }
        const base64Data = Buffer.from(
          base64.replace(/^data:\w+\/[a-zA-Z+\-.]+;base64,/, ""),
          "base64"
        );

        console.log("uploading fileSource...");

        const type = base64.split(";")[0].split("/")[1];

        const originalname = `${uuid()}.${type}`;

        const saveImageDataDB = async (filename: any, driverId: any) => {
          const driverImage = await prismaClient.driverImage.create({
            data: {
              originalname: filename,
              driverId: driverId,
            },
          });
          console.log("saving image succes: ", driverImage);
        };

        const data: any = {
          Bucket: process.env.DO_BUCKET_NAME,
          Key: `drivers/${originalname}`,
          Body: base64Data,
          ContentEncoding: "base64",
          ContentType:
            mime.lookup(`${originalname}`) || "application/octet-stream", //We add 'application/octet-stream' in case mym-types can't read our file typee
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

          saveImageDataDB(originalname, user?.driver?.id);

          console.log("success upload: ", data);
        } catch (error: any) {
          //handle error
          res
            .status(error?.status || 400)
            .send(error?.message || "Something went wrong!");
        }
      });
    }
  }

  res.status(200).json({
    message: "Resubmitted images successfully",
    result: "true",
  });
};

export const emailResubmittedImageDriver = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.body;

  console.log("emailResubmittedImageDriver");

  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      driver: true,
    },
  });

  if (!user) {
    res.status(404).send("No user found");
  }

  if (user?.driver) {
    console.log("driverid: ", user?.driver?.id);
    const driverImages = await prismaClient.driverImage.findMany({
      where: {
        driverId: user?.driver?.id,
      },
    });

    const vehicle = await prismaClient.vehicle.findUnique({
      where: {
        driverId: user?.driver?.id,
      },
    });

    const mergedDriverData = {
      user: {
        ...user,
        vehicle,
        driverImages,
      },
    };

    let imgURLArray: any[] = [];
    if (driverImages?.length > 0) {
      driverImages?.map((imgItem: any) => {
        // s3 DO spaces fetch images linked
        const url = s3.getSignedUrl("getObject", {
          Bucket: process.env.DO_BUCKET_NAME,
          Key: `drivers/${imgItem.originalname}`,
          Expires: 604800, // 7 days in seconds
        });

        imgURLArray.push(url);
      });
    }

    console.log("imgURLArray: ", imgURLArray);

    // Gmail SMTP configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    if (vehicle) {
      // Send email with the new created agent driver account link
      const mailOptions = {
        from: process.env.SMTP_SENDER,
        to: process.env.EMAIL_APPROVER,
        subject:
          "Approval Notification: New Agent Driver Resubmission of Image",
        html: `
            <p>Dear [Admin/Recipient's Name],</p>
            <p>A new agent driver has been resubmitted an image and is pending approval. Please review the details below and take appropriate action.</p>
            <p>Account Details:</p>
            <ul>
              <li>First Name: ${user?.firstName}</li>
              <li>Middle Name: ${user?.middleName}</li>
              <li>Last Name: ${user?.lastName}</li>
              <li>Suffix Name: ${user?.suffixName}</li>
              <li>Date of Birth: ${user?.dateOfBirth}</li>
              <li>Address Line 1: ${user?.addressLine1}</li>
              <li>Address Line 2: ${user?.addressLine2}</li>
              <li>Email: ${user?.email}</li>
              <li>Role: ${user?.role}</li>
            </ul>
            <br>
            <ul>
              <li>Drivers License: ${user?.driver?.dl}</li>
              <li>SSN: ${user?.driver?.ssn}</li>
              <li>Preferred Location: ${user?.driver?.preferredLoc}</li>
              <li>Date Registered: ${user?.driver?.dateRegistered}</li>
              <li>Date Approved: ${user?.driver?.dateApproved}</li>
            </ul>
            <br>
            <ul>
              <li>Vehicle Make: ${vehicle?.vehicleMake}</li>
              <li>Vehicle Model: ${vehicle?.vehicleModel}</li>
              <li>Vehicle Year: ${vehicle?.vehicleYear}</li>
            </ul>
            <br>
            
            <ul>
              ${imgURLArray
                .map(
                  (url, index) =>
                    `<li>${index + 1}. <a href="${url}">${url}</a></li>`
                )
                .join("")}
            </ul>
            <br>
            
            <p>Click the link below to approve or decline:</p>
            <p><a href="${
              process.env.AGENT_DRIVER_PORTAL_URL
            }/account-approval/${user?.id}">Approve/Decline</a></p>
        
            
            <p>Once approved, the user will be granted access to the system.</p>
            <p>Thank you.</p>
            <p>Best Regards,<br>Screenzads</p>
          `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ message: "Failed to send email" });
        }
        console.log("Email sent:", info.response);
        res.json({ message: "Email sent successfully" });
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "Something went wrong in vehicle data",
        error: "Something went wrong in vehicle data",
      });
    }

    res.json({
      message:
        "New driver account resubmitted image successfully and check your email for approval of your account",
      result: "true",
      data: { ...mergedDriverData },
    });
  } else {
    res.status(400).json({
      status: 400,
      message: "Something went wrong in driver data",
      error: "Something went wrong in driver data",
    });
  }
};
