import { Router } from "express";
import {
  getAccount,
  resubmitImage,
  emailResubmittedImageDriver,
} from "../controllers/resubmit-image.controller";

const resubmitImageRoutes: Router = Router();

resubmitImageRoutes.get("/get-account/:userId", getAccount);
resubmitImageRoutes.post("/resubmit-image", resubmitImage);
resubmitImageRoutes.post(
  "/email-resubmitted-image",
  emailResubmittedImageDriver
);

export default resubmitImageRoutes;
