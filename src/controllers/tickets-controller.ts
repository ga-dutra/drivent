import { AuthenticatedRequest } from "@/middlewares";
import ticketsService from "@/services/tickets-service";
import httpStatus from "http-status";
import { Response } from "express";

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketsTypes = await ticketsService.getTicketTypesForEvent();
    return res.status(httpStatus.OK).send(ticketsTypes);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}
