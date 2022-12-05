import { authenticateToken } from "@/middlewares";
import { Router } from "express";
import { getBooking, postBooking, putBooking } from "@/controllers/booking-controller";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", getBooking)
  .post("/", postBooking)
  .put("/:bookingId", putBooking);

export { bookingRouter };
