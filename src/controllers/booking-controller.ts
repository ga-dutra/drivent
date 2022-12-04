import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import { Response } from "express";
import bookingService from "@/services/booking-service";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const booking = await bookingService.getBookingByUserId(Number(userId));

    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;

  if (!roomId ||  isNaN(roomId) || Number(roomId) < 1 ) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const newBooking = await bookingService.postBooking(Number(userId), Number(roomId));
    return res.status(httpStatus.OK).send(newBooking);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    else if(error.name === "RoomIsFullError" || error.name === "InvalidTicketError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { bookingId } = req.params;
  const { roomId } = req.body;
  
  if (!bookingId || !roomId || Number(bookingId) < 1 
      || Number(roomId) < 1 || isNaN(Number(roomId)) || isNaN(Number(bookingId))) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const updatedBooking = await bookingService.updateBooking(Number(bookingId), Number(roomId), Number(userId));
    return res.status(httpStatus.OK).send(updatedBooking);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    else if(error.name === "RoomIsFullError" || error.name === "InvalidTicketError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
