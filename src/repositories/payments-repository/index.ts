import { prisma } from "@/config";
import { Payment } from "@/protocols";

async function findTicketById(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId
    }
  });
}

async function findPaymentById(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId
    }
  });
}

async function createPayment(payment: Payment, ticketTypeId: number) {
  const ticketType = await prisma.ticketType.findUnique({
    where: {
      id: ticketTypeId
    }
  });
  const value = ticketType.price;
  
  return prisma.payment.create({
    data: {
      ticketId: payment.ticketId,
      cardIssuer: payment.cardData.issuer,
      cardLastDigits: payment.cardData.number.slice(-4),
      value
    }
  });
}

async function findEnrollmentByUserId(userId: number) {
  return await prisma.enrollment.findUnique({
    where: {
      userId
    }
  });
}

async function updateTicketPayment(ticketId: number) {
  return prisma.ticket.update({
    where: {
      id: ticketId
    },
    data: {
      status: "PAID"
    }
  });
}

const paymentRepository = {
  findTicketById,
  findPaymentById,
  createPayment,
  findEnrollmentByUserId,
  updateTicketPayment
};

export default paymentRepository;
