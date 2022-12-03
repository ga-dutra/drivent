import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import hotelService from "@/services/hotels-service";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const hotels = await hotelService.getHotels(Number(userId));
    
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    else if (error.name === "CannotListHotelsError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getRoomsByHotelId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotelId = Number(req.query.hotelId);

  if(!hotelId || isNaN(hotelId)) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const hotel = await hotelService.getHotelById(hotelId);
    if (!hotel) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    const rooms = await hotelService.getRoomsByHotelId(userId, hotelId);
    return res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "CannotListHotelsError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
