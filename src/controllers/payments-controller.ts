import { AuthenticatedRequest } from "@/middlewares";
import paymentsService from "@/services/payments-service";
import httpStatus from "http-status";
import { Response } from "express";
import { Payment } from "@/protocols";

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

async function postPayment(req: AuthenticatedRequest, res: Response) {
  const payment = req.body as Payment;
  const { userId } = req;

  if (!payment.cardData || !payment.ticketId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const userEnrollment = await paymentsService.getEnrollmentByUserId(Number(userId));

    const userTicket = await paymentsService.getTicketById(Number(payment.ticketId));

    if (userEnrollment.id !== userTicket.enrollmentId) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    if (!userTicket) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    const newPayment = await paymentsService.postPayment(payment);
    return res.status(httpStatus.OK).send(newPayment);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export {
  getPayments,
  postPayment
};
