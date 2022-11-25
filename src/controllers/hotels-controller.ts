import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import hotelService from "@/services/hotels-service";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const hotels = await hotelService.getHotels();
    
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getRoomsByHotelId(req: AuthenticatedRequest, res: Response) {
  const hotelId = Number(req.query.hotelId);

  if(!hotelId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  const hotel = await hotelService.getRoomsByHotelId(hotelId);
  return res.status(httpStatus.OK).send(hotel);
}
