import { prisma } from "@/config";

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

const paymentRepository = {
  findTicketById,
  findPaymentById
};

export default paymentRepository;
