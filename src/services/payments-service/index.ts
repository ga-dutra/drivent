import { Payment } from "@/protocols";
import paymentRepository from "@/repositories/payments-repository";
import { Ticket } from "@prisma/client";

let ticket: Ticket;

async function getTicketById(ticketId: number) {
  ticket = await paymentRepository.findTicketById(ticketId);
  return ticket;
}

async function getPaymentById(ticketId: number) {
  const payment = await paymentRepository.findPaymentById(ticketId);
  return payment;
}

async function postPayment(payment: Payment) {
  const newPayment = await paymentRepository.createPayment(payment, ticket.ticketTypeId);
  await paymentRepository.updateTicketPayment(Number(payment.ticketId));

  return {
    ...newPayment,
    cardLastDigits: newPayment.cardLastDigits
  };
}

async function getEnrollmentByUserId(userId: number) {
  return paymentRepository.findEnrollmentByUserId(userId);
}

const paymentsService = {
  getTicketById,
  getPaymentById,
  postPayment,
  getEnrollmentByUserId
};

export default paymentsService;
