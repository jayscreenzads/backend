import { Router } from "express";
import {
  createDriver,
  deleteDriver,
  getDriver,
  getDrivers,
  updateDriver,
} from "../controllers/driver.controller";
import { auth } from "../middlewares/verifyToken";

const driverRoutes: Router = Router();

driverRoutes.get("/get-drivers", auth, getDrivers);
driverRoutes.get("/get-driver/:id", auth, getDriver);
driverRoutes.post("/create-driver", auth, createDriver);
driverRoutes.put("/update-driver/:id", auth, updateDriver);
driverRoutes.delete("/delete-driver/:id", auth, deleteDriver);

export default driverRoutes;
