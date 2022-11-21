import { AuthenticatedRequest } from "@/middlewares";
import paymentsService from "@/services/payments-service";
import httpStatus from "http-status";
import { Response } from "express";

async function getPayments(req: AuthenticatedRequest, res: Response) {
  const { ticketId } = req.query;

  if(!ticketId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const userTicket = await paymentsService.getTicketById(Number(ticketId));
    if (!userTicket) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    const userPayment = await paymentsService.getPaymentById(Number(ticketId));
    if (!userPayment) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    return res.status(httpStatus.OK).send(userPayment);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export {
  getPayments,
};
