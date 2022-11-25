import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getRoomsByHotelId, getHotels } from "@/controllers/hotels-controller";

const hotelsRouter = Router();

hotelsRouter
  .all("*/", authenticateToken)
  .get("/", getHotels)
  .get("/:hotelId", getRoomsByHotelId);

export { hotelsRouter };
