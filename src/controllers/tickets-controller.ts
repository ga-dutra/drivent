import { AuthenticatedRequest } from "@/middlewares";
import ticketsService from "@/services/tickets-service";
import httpStatus from "http-status";
import { Response } from "express";

async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketsTypes = await ticketsService.getTicketTypesForEvent();
    return res.status(httpStatus.OK).send(ticketsTypes);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

async function getTickets(req: AuthenticatedRequest, res: Response) {
  try {
    const eventTicket = await ticketsService.getTickets();

    if (!eventTicket.id) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.status(httpStatus.OK).send(eventTicket);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

async function postTicket(req: AuthenticatedRequest, res: Response) {
  const { ticketTypeId } = req.body;
  const { userId } = req;
  
  if (!ticketTypeId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const enrollment = await ticketsService.getEnrollmentByUserId(Number(userId));

    if (!enrollment) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    const newTicket = await ticketsService.postTicket(Number(ticketTypeId), Number(enrollment.id));

    return res.status(httpStatus.CREATED).send(newTicket);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export {
  getTicketTypes,
  getTickets,
  postTicket,
};
