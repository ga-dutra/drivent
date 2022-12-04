import { authenticateToken } from "@/middlewares";
import { Router } from "express";
import { getBooking } from "@/controllers/booking-controller";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", getBooking);

export { bookingRouter };
