import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getRoomsByHotelId, getHotels } from "@/controllers/hotels-controller";

const hotelsRouter = Router();

hotelsRouter
  .get("/", getHotels)
  .get("/:hotelId", getRoomsByHotelId);

export { hotelsRouter };
